import { useEffect, useState } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import useAuth from "../../hooks/useAuth";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const AdminAnalytics = () => {
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const { auth } = useAuth();

  const [feedbacks, setFeedbacks] = useState([]);
  const [companyUsers, setCompanyUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [userTypeFilter, setUserTypeFilter] = useState("all"); // 'all', 'registered', 'anonymous'
  const [exporting, setExporting] = useState(false);

  // Fetch feedbacks and users
  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        setLoading(true);
        // Fetch company feedbacks
        const feedsRes = await axiosPrivate.get(`/companyfeedbacks/${auth.slug}`);
        const feedsData = feedsRes?.data?.feedbacks || [];
        setFeedbacks(feedsData);

        // Fetch company users
        const usersRes = await axiosPrivate.get("/companyusers");
        const usersData = usersRes?.data?.users || [];
        setCompanyUsers(usersData);
      } catch (err) {
        console.log(err?.response || err);
      } finally {
        setLoading(false);
      }
    };
    if (auth?.slug) {
      fetchAdminData();
    }
  }, [auth?.slug, axiosPrivate]);

  // Filter feedbacks by User Type
  const getFilteredFeedbacks = () => {
    switch (userTypeFilter) {
      case "registered":
        return feedbacks.filter((f) => f.userID !== null && f.userID !== undefined);
      case "anonymous":
        return feedbacks.filter((f) => f.userID === null || f.userID === undefined);
      default:
        return feedbacks;
    }
  };

  const filteredFeeds = getFilteredFeedbacks();

  // 1. General Metrics
  const totalCount = filteredFeeds.length;
  
  const avgRating = totalCount
    ? Number((filteredFeeds.reduce((sum, f) => sum + (f.rating || 0), 0) / totalCount).toFixed(2))
    : 0;

  // Review Coverage: feedbacks with custom admin message
  const reviewedCount = filteredFeeds.filter(
    (f) => f.adminMessage !== null && f.adminMessage !== undefined && f.adminMessage.trim() !== ""
  ).length;

  const reviewCoverage = totalCount ? Math.round((reviewedCount / totalCount) * 100) : 0;

  // Resolution Rate: resolved or approved
  const resolvedCount = filteredFeeds.filter(
    (f) => f.status?.toLowerCase() === "resolved" || f.status?.toLowerCase() === "approved"
  ).length;

  const resolutionRate = totalCount ? Math.round((resolvedCount / totalCount) * 100) : 0;

  // 2. User Engagement
  const totalUsersCount = companyUsers.length;
  // Unique users who have submitted at least one feedback
  const uniqueSubmitters = new Set(
    feedbacks
      .filter((f) => f.userID)
      .map((f) => f.userID.toString())
  );
  const activeUsersCount = uniqueSubmitters.size;
  const participationRate = totalUsersCount
    ? Math.round((activeUsersCount / totalUsersCount) * 100)
    : 0;

  // Authenticity ratios (Anonymous vs Registered)
  const registeredCount = filteredFeeds.filter((f) => f.userID).length;
  const anonymousCount = totalCount - registeredCount;
  
  const registeredPercentage = totalCount ? Math.round((registeredCount / totalCount) * 100) : 0;
  const anonymousPercentage = totalCount ? 100 - registeredPercentage : 0;

  // 3. Status Pipeline Distribution
  const statusConfig = {
    pending: { label: "Pending Review", color: "bg-secondary", icon: "🕒" },
    in_review: { label: "In Review", color: "bg-warning text-dark", icon: "🔍" },
    approved: { label: "Approved", color: "bg-primary", icon: "✅" },
    resolved: { label: "Resolved", color: "bg-success", icon: "🎉" },
    rejected: { label: "Rejected", color: "bg-danger", icon: "❌" }
  };

  const getStatusData = () => {
    const counts = { pending: 0, in_review: 0, approved: 0, resolved: 0, rejected: 0 };
    filteredFeeds.forEach((f) => {
      const statusKey = f.status?.toLowerCase() || "pending";
      if (counts[statusKey] !== undefined) {
        counts[statusKey]++;
      } else {
        counts["pending"]++;
      }
    });

    return Object.keys(counts).map((key) => {
      const count = counts[key];
      const percentage = totalCount ? Math.round((count / totalCount) * 100) : 0;
      return {
        key,
        count,
        percentage,
        ...statusConfig[key]
      };
    });
  };

  const statusData = getStatusData();

  // 4. Category Sentiment Grid (Average ratings by category)
  const categoryConfig = {
    bug: { label: "Bug Reports", colorClass: "border-danger text-danger bg-danger-subtle" },
    "feature-request": { label: "Feature Requests", colorClass: "border-primary text-primary bg-primary-subtle" },
    ui: { label: "UI/UX issues", colorClass: "border-info text-info bg-info-subtle" },
    content: { label: "Content Quality", colorClass: "border-warning text-warning bg-warning-subtle" },
    other: { label: "Other Topics", colorClass: "border-secondary text-secondary bg-secondary-subtle" }
  };

  const getCategorySentiment = () => {
    const ratings = { bug: [], "feature-request": [], ui: [], content: [], other: [] };

    filteredFeeds.forEach((f) => {
      const categories = Array.isArray(f.category) ? f.category : [f.category];
      categories.forEach((cat) => {
        const key = cat?.toLowerCase();
        if (ratings[key] !== undefined && f.rating) {
          ratings[key].push(f.rating);
        } else if (f.rating) {
          ratings["other"].push(f.rating);
        }
      });
    });

    return Object.keys(ratings).map((key) => {
      const list = ratings[key];
      const count = list.length;
      const avg = count ? Number((list.reduce((sum, r) => sum + r, 0) / count).toFixed(2)) : 0;
      
      // Determine Alert Color based on average rating
      let alertClass = "border-success text-success bg-success-subtle"; // Happy (>= 4.0)
      let sentimentEmoji = "😊 Satisfied";
      if (count === 0) {
        alertClass = "border-light text-muted bg-light";
        sentimentEmoji = "No Data";
      } else if (avg < 2.5) {
        alertClass = "border-danger text-danger bg-danger-subtle"; // Critical (< 2.5)
        sentimentEmoji = "🚨 Needs Attention";
      } else if (avg < 4.0) {
        alertClass = "border-warning text-warning-emphasis bg-warning-subtle"; // Neutral (2.5 - 3.9)
        sentimentEmoji = "😐 Neutral";
      }

      return {
        key,
        count,
        avg,
        alertClass,
        sentimentEmoji,
        label: categoryConfig[key]?.label || key
      };
    });
  };

  const categorySentiment = getCategorySentiment();

  // Export CSV Helper
  const handleExportCSV = async () => {
    try {
      setExporting(true);
      const response = await axiosPrivate.get("/feedback/export/csv", {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `company_feedback_report_${new Date().toISOString().split("T")[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.log("CSV Export failed:", err);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="container py-5">
      {/* Header section */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 pb-3 border-bottom">
        <div>
          <button className="btn btn-outline-secondary btn-sm mb-2" onClick={() => navigate(-1)}>
            &larr; Back to Dashboard
          </button>
          <h2 className="text-primary fw-bold mb-0">🔑 Admin Analytics</h2>
          <p className="text-muted mb-0">Overview metrics for feedbacks and engagement trends</p>
        </div>

        <div className="d-flex flex-column flex-sm-row gap-3 mt-3 mt-md-0 w-100 w-md-auto">
          {/* User Type Filters */}
          <div className="btn-group" role="group" aria-label="User filter">
            <button
              type="button"
              className={`btn btn-sm ${userTypeFilter === "all" ? "btn-primary" : "btn-outline-primary"}`}
              onClick={() => setUserTypeFilter("all")}
            >
              All
            </button>
            <button
              type="button"
              className={`btn btn-sm ${userTypeFilter === "registered" ? "btn-primary" : "btn-outline-primary"}`}
              onClick={() => setUserTypeFilter("registered")}
            >
              Registered
            </button>
            <button
              type="button"
              className={`btn btn-sm ${userTypeFilter === "anonymous" ? "btn-primary" : "btn-outline-primary"}`}
              onClick={() => setUserTypeFilter("anonymous")}
            >
              Anonymous
            </button>
          </div>

          {/* Export Report */}
          <button
            onClick={handleExportCSV}
            className="btn btn-sm btn-success rounded px-3"
            disabled={exporting || totalCount === 0}
          >
            {exporting ? (
              <>
                <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                Exporting...
              </>
            ) : (
              "📥 Export CSV Report"
            )}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center my-5 py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-muted">Calculating administrative analytics...</p>
        </div>
      ) : feedbacks.length === 0 ? (
        <div className="text-center py-5 bg-light rounded-4 shadow-sm">
          <p className="fs-5 text-secondary">No feedback submissions found in your company database yet.</p>
        </div>
      ) : (
        <>
          {/* Summary KPIs Row */}
          <div className="row g-4 mb-5">
            <div className="col-md-3">
              <div className="card shadow-sm border-0 h-100 bg-white">
                <div className="card-body d-flex align-items-center">
                  <div className="p-3 rounded-circle bg-primary-subtle text-primary me-3">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                  </div>
                  <div>
                    <h6 className="card-subtitle text-muted mb-1 text-uppercase fw-semibold" style={{ fontSize: "0.7rem" }}>Total Feedbacks</h6>
                    <h3 className="card-title mb-0 fw-bold">{totalCount}</h3>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-3">
              <div className="card shadow-sm border-0 h-100 bg-white">
                <div className="card-body d-flex align-items-center">
                  <div className="p-3 rounded-circle bg-info-subtle text-info me-3">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
                    </svg>
                  </div>
                  <div>
                    <h6 className="card-subtitle text-muted mb-1 text-uppercase fw-semibold" style={{ fontSize: "0.7rem" }}>Review Coverage</h6>
                    <h3 className="card-title mb-0 fw-bold">{reviewCoverage}%</h3>
                    <small className="text-muted">{reviewedCount} / {totalCount} replied</small>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-3">
              <div className="card shadow-sm border-0 h-100 bg-white">
                <div className="card-body d-flex align-items-center">
                  <div className="p-3 rounded-circle bg-success-subtle text-success me-3">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M8 12.5l3 3 5-6" />
                    </svg>
                  </div>
                  <div>
                    <h6 className="card-subtitle text-muted mb-1 text-uppercase fw-semibold" style={{ fontSize: "0.7rem" }}>Resolution Rate</h6>
                    <h3 className="card-title mb-0 fw-bold">{resolutionRate}%</h3>
                    <small className="text-muted">{resolvedCount} resolved/approved</small>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-3">
              <div className="card shadow-sm border-0 h-100 bg-white">
                <div className="card-body d-flex align-items-center">
                  <div className="p-3 rounded-circle bg-warning-subtle text-warning me-3">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  </div>
                  <div>
                    <h6 className="card-subtitle text-muted mb-1 text-uppercase fw-semibold" style={{ fontSize: "0.7rem" }}>Average Score</h6>
                    <div className="d-flex align-items-center">
                      <h3 className="card-title mb-0 fw-bold me-1">{avgRating}</h3>
                      <span className="text-warning fs-5">★</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row g-4 mb-5">
            {/* Status Pipeline / Funnel */}
            <div className="col-lg-6">
              <div className="card shadow-sm border-0 bg-white h-100">
                <div className="card-body">
                  <h5 className="card-title fw-bold text-dark mb-4">Feedback Status Pipeline</h5>
                  <div className="d-flex flex-column gap-4">
                    {statusData.map((item) => (
                      <div key={item.key}>
                        <div className="d-flex justify-content-between align-items-center mb-1">
                          <span className="fw-semibold text-secondary" style={{ fontSize: "0.9rem" }}>
                            {item.icon} {item.label}
                          </span>
                          <span className="fw-bold text-dark" style={{ fontSize: "0.9rem" }}>
                            {item.count} items ({item.percentage}%)
                          </span>
                        </div>
                        <div className="progress animate-progress" style={{ height: "12px", borderRadius: "6px", backgroundColor: "#e9ecef" }}>
                          <div
                            className={`progress-bar ${item.color}`}
                            style={{
                              width: `${item.percentage}%`,
                              borderRadius: "6px",
                              transition: "width 1s ease",
                            }}
                            role="progressbar"
                            aria-valuenow={item.percentage}
                            aria-valuemin="0"
                            aria-valuemax="100"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Authenticity & Engagement Stats */}
            <div className="col-lg-6">
              <div className="card shadow-sm border-0 bg-white h-100 d-flex flex-column">
                <div className="card-body d-flex flex-column justify-content-between">
                  <div>
                    <h5 className="card-title fw-bold text-dark mb-4">Submission Authenticity Ratio</h5>
                    <p className="text-muted" style={{ fontSize: "0.85rem" }}>
                      Registered vs Anonymous feedback breakdown. Anonymous feedbacks represent immediate customer reviews, whereas registered feedbacks carry trace user emails.
                    </p>

                    <div className="my-4">
                      <div className="d-flex justify-content-between mb-2">
                        <span className="text-primary fw-bold">📧 Registered ({registeredPercentage}%)</span>
                        <span className="text-secondary fw-bold">🎭 Anonymous ({anonymousPercentage}%)</span>
                      </div>
                      
                      {/* Stacked Progress Bar */}
                      <div className="progress" style={{ height: "24px", borderRadius: "12px" }}>
                        <div
                          className="progress-bar bg-primary"
                          role="progressbar"
                          style={{ width: `${registeredPercentage}%` }}
                          aria-valuenow={registeredPercentage}
                          aria-valuemin="0"
                          aria-valuemax="100"
                        >
                          {registeredPercentage > 10 ? `${registeredPercentage}%` : ""}
                        </div>
                        <div
                          className="progress-bar bg-secondary"
                          role="progressbar"
                          style={{ width: `${anonymousPercentage}%` }}
                          aria-valuenow={anonymousPercentage}
                          aria-valuemin="0"
                          aria-valuemax="100"
                        >
                          {anonymousPercentage > 10 ? `${anonymousPercentage}%` : ""}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-light rounded-3 mt-3">
                    <h6 className="fw-bold text-secondary mb-2">User Participation Summary</h6>
                    <div className="row text-center mt-2">
                      <div className="col-4">
                        <h4 className="fw-bold mb-0 text-dark">{totalUsersCount}</h4>
                        <small className="text-muted" style={{ fontSize: "0.75rem" }}>Total Users</small>
                      </div>
                      <div className="col-4">
                        <h4 className="fw-bold mb-0 text-primary">{activeUsersCount}</h4>
                        <small className="text-muted" style={{ fontSize: "0.75rem" }}>Active Submitters</small>
                      </div>
                      <div className="col-4">
                        <h4 className="fw-bold mb-0 text-success">{participationRate}%</h4>
                        <small className="text-muted" style={{ fontSize: "0.75rem" }}>Engagement</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sentiment Heatmap Grid */}
          <div className="card shadow-sm border-0 bg-white mb-4">
            <div className="card-body">
              <h5 className="card-title fw-bold text-dark mb-2">Category Rating Sentiment</h5>
              <p className="card-subtitle text-muted mb-4" style={{ fontSize: "0.85rem" }}>
                Identifies product pain points by calculating the average rating for each feedback category
              </p>

              <div className="row g-3">
                {categorySentiment.map((item) => (
                  <div className="col-md" key={item.key}>
                    <div className={`card h-100 border p-3 rounded-3 shadow-none ${item.alertClass}`} style={{ transition: "all 0.2s" }}>
                      <h6 className="fw-bold text-uppercase mb-1" style={{ fontSize: "0.75rem" }}>{item.label}</h6>
                      <div className="d-flex align-items-baseline mb-2">
                        <h2 className="mb-0 fw-bold me-1">{item.count > 0 ? item.avg : "--"}</h2>
                        {item.count > 0 && <span className="fs-6">★</span>}
                      </div>
                      <div className="d-flex justify-content-between align-items-center mt-auto border-top pt-2" style={{ fontSize: "0.75rem" }}>
                        <span className="fw-semibold">{item.sentimentEmoji}</span>
                        <span className="text-muted">({item.count} items)</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminAnalytics;
