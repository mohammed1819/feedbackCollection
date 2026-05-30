import { useEffect, useState } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { Link, useNavigate } from "react-router-dom";
import ReactStars from "react-rating-star-with-type";
import "bootstrap/dist/css/bootstrap.min.css";

const FeedBackStats = () => {
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();

  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState("all"); // '7days', '30days', 'all'
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [hoveredTrendPoint, setHoveredTrendPoint] = useState(null);

  // Fetch all user feedbacks
  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        setLoading(true);
        const response = await axiosPrivate.get("/myfeedbacks");
        if (response?.data?.message) {
          setFeedbacks([]);
          return;
        }
        const feedbacksData = response?.data?.feedbacks || [];
        setFeedbacks(feedbacksData.map(f => ({ ...f, status: f.status || 'pending' })));
      } catch (err) {
        console.log(err?.response || err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeedbacks();
  }, [axiosPrivate]);

  // Filter feedbacks based on active timeframe
  const getFilteredFeedbacks = () => {
    if (timeframe === "all") return feedbacks;

    const now = new Date();
    const cutoff = new Date();
    if (timeframe === "7days") {
      cutoff.setDate(now.getDate() - 7);
    } else if (timeframe === "30days") {
      cutoff.setDate(now.getDate() - 30);
    }

    return feedbacks.filter((f) => {
      const date = new Date(f.submittedAt);
      return date >= cutoff;
    });
  };

  const filteredFeedbacks = getFilteredFeedbacks();

  // Summary Metrics calculations
  const totalCount = filteredFeedbacks.length;
  const avgRating = totalCount
    ? Number((filteredFeedbacks.reduce((sum, f) => sum + (f.rating || 0), 0) / totalCount).toFixed(2))
    : 0;
  
  const pendingCount = filteredFeedbacks.filter(
    (f) => f.status?.toLowerCase() === "pending"
  ).length;

  const resolvedCount = filteredFeedbacks.filter(
    (f) =>
      f.status?.toLowerCase() === "resolved" ||
      f.status?.toLowerCase() === "approved"
  ).length;

  const resolutionRate = totalCount
    ? Math.round((resolvedCount / totalCount) * 100)
    : 0;

  // Category distribution
  const categoryConfig = {
    "bug": { label: "Bug", color: "#dc3545" },
    "feature-request": { label: "Feature Request", color: "#0d6efd" },
    "ui": { label: "UI", color: "#6f42c1" },
    "content": { label: "Content", color: "#fd7e14" },
    "other": { label: "Other", color: "#6c757d" }
  };

  const getCategoryData = () => {
    const counts = { "bug": 0, "feature-request": 0, "ui": 0, "content": 0, "other": 0 };
    
    filteredFeedbacks.forEach((f) => {
      const cats = Array.isArray(f.category) ? f.category : [f.category];
      cats.forEach((cat) => {
        const key = cat?.toLowerCase();
        if (counts[key] !== undefined) {
          counts[key]++;
        } else {
          counts["other"]++;
        }
      });
    });

    const totalCats = Object.values(counts).reduce((a, b) => a + b, 0);

    return Object.keys(counts).map((key) => {
      const count = counts[key];
      const percentage = totalCats ? Math.round((count / totalCats) * 100) : 0;
      return {
        key,
        count,
        percentage,
        label: categoryConfig[key].label,
        color: categoryConfig[key].color
      };
    }).filter(item => item.count > 0); // Only return categories with data
  };

  const categoryData = getCategoryData();

  // Ratings distribution (5 to 1 star)
  const getRatingDistribution = () => {
    const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    filteredFeedbacks.forEach((f) => {
      const rating = Math.round(f.rating);
      if (counts[rating] !== undefined) {
        counts[rating]++;
      }
    });

    return [5, 4, 3, 2, 1].map((stars) => {
      const count = counts[stars];
      const percentage = totalCount ? Math.round((count / totalCount) * 100) : 0;
      return { stars, count, percentage };
    });
  };

  const ratingDistribution = getRatingDistribution();

  // Submission trends over time
  const getTrendData = () => {
    const counts = {};
    if (timeframe === "7days" || timeframe === "30days") {
      const days = timeframe === "7days" ? 7 : 30;
      for (let i = days - 1; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().split("T")[0];
        counts[dateStr] = 0;
      }

      filteredFeedbacks.forEach((f) => {
        const dateStr = new Date(f.submittedAt).toISOString().split("T")[0];
        if (counts[dateStr] !== undefined) {
          counts[dateStr]++;
        }
      });

      return Object.keys(counts).map((dateStr) => {
        const d = new Date(dateStr);
        const label = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
        return { label, count: counts[dateStr] };
      });
    } else {
      // Group by Month-Year for all time
      filteredFeedbacks.forEach((f) => {
        const d = new Date(f.submittedAt);
        const monthKey = d.toLocaleDateString("en-US", { month: "short", year: "2-digit" });
        counts[monthKey] = (counts[monthKey] || 0) + 1;
      });

      const sortedMonths = Object.keys(counts).sort((a, b) => new Date(a) - new Date(b));
      return sortedMonths.map((month) => ({
        label: month,
        count: counts[month]
      }));
    }
  };

  const trendData = getTrendData();

  // SVG calculations for Category Donut Chart
  const donutRadius = 50;
  const donutCircumference = 2 * Math.PI * donutRadius; // ~314.16
  let cumulativePercentage = 0;

  // SVG calculations for Trend Spline Chart
  const chartWidth = 500;
  const chartHeight = 180;
  const paddingX = 40;
  const paddingY = 20;

  const getTrendPath = () => {
    if (trendData.length < 2) return "";
    const maxVal = Math.max(...trendData.map((d) => d.count), 1);
    const points = trendData.map((d, index) => {
      const x = paddingX + (index * (chartWidth - 2 * paddingX)) / (trendData.length - 1);
      const y = chartHeight - paddingY - (d.count / maxVal) * (chartHeight - 2 * paddingY);
      return { x, y };
    });

    let path = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i];
      const p1 = points[i + 1];
      const cpX1 = p0.x + (p1.x - p0.x) / 2;
      const cpY1 = p0.y;
      const cpX2 = p1.x - (p1.x - p0.x) / 2;
      const cpY2 = p1.y;
      path += ` C ${cpX1} ${cpY1} ${cpX2} ${cpY2} ${p1.x} ${p1.y}`;
    }
    return path;
  };

  const getTrendAreaPath = () => {
    if (trendData.length < 2) return "";
    const linePath = getTrendPath();
    const maxVal = Math.max(...trendData.map((d) => d.count), 1);
    const startX = paddingX;
    const endX = paddingX + (trendData.length - 1) * (chartWidth - 2 * paddingX) / (trendData.length - 1);
    const floorY = chartHeight - paddingY;
    return `${linePath} L ${endX} ${floorY} L ${startX} ${floorY} Z`;
  };

  const trendPoints = trendData.map((d, index) => {
    const maxVal = Math.max(...trendData.map((td) => td.count), 1);
    const x = paddingX + (index * (chartWidth - 2 * paddingX)) / (trendData.length - 1);
    const y = chartHeight - paddingY - (d.count / maxVal) * (chartHeight - 2 * paddingY);
    return { ...d, x, y };
  });

  return (
    <div className="container py-5">
      {/* Page Header */}
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center mb-4">
        <div>
          <button className="btn btn-outline-secondary btn-sm mb-2" onClick={() => navigate(-1)}>
            &larr; Back
          </button>
          <h2 className="text-primary fw-bold mb-0">📊 Feedback Analytics</h2>
        </div>

        {/* Timeframe Filter Buttons */}
        <div className="btn-group mt-3 mt-sm-0" role="group" aria-label="Timeframe Filter">
          <button
            type="button"
            className={`btn btn-sm ${timeframe === "7days" ? "btn-primary" : "btn-outline-primary"}`}
            onClick={() => setTimeframe("7days")}
          >
            7 Days
          </button>
          <button
            type="button"
            className={`btn btn-sm ${timeframe === "30days" ? "btn-primary" : "btn-outline-primary"}`}
            onClick={() => setTimeframe("30days")}
          >
            30 Days
          </button>
          <button
            type="button"
            className={`btn btn-sm ${timeframe === "all" ? "btn-primary" : "btn-outline-primary"}`}
            onClick={() => setTimeframe("all")}
          >
            All Time
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center my-5 py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-muted">Analyzing your feedbacks...</p>
        </div>
      ) : feedbacks.length === 0 ? (
        <div className="text-center py-5 bg-light rounded-4 shadow-sm">
          <p className="fs-5 text-secondary mb-3">No stats to show since you have not submitted any feedbacks yet.</p>
          <Link to="/feedbackform" className="btn btn-primary rounded-pill px-4">
            Submit Feedback
          </Link>
        </div>
      ) : (
        <>
          {/* KPI Metrics Cards */}
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
                    <h6 className="card-subtitle text-muted mb-1 text-uppercase fw-semibold" style={{ fontSize: "0.75rem" }}>Total Feedback</h6>
                    <h3 className="card-title mb-0 fw-bold">{totalCount}</h3>
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
                    <h6 className="card-subtitle text-muted mb-1 text-uppercase fw-semibold" style={{ fontSize: "0.75rem" }}>Avg. Rating</h6>
                    <div className="d-flex align-items-center">
                      <h3 className="card-title mb-0 fw-bold me-2">{avgRating}</h3>
                      <span className="text-warning fw-bold fs-5">★</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-3">
              <div className="card shadow-sm border-0 h-100 bg-white">
                <div className="card-body d-flex align-items-center">
                  <div className="p-3 rounded-circle bg-success-subtle text-success me-3">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                      <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                  </div>
                  <div>
                    <h6 className="card-subtitle text-muted mb-1 text-uppercase fw-semibold" style={{ fontSize: "0.75rem" }}>Resolution Rate</h6>
                    <h3 className="card-title mb-0 fw-bold">{resolutionRate}%</h3>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-3">
              <div className="card shadow-sm border-0 h-100 bg-white">
                <div className="card-body d-flex align-items-center">
                  <div className="p-3 rounded-circle bg-danger-subtle text-danger me-3">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                  </div>
                  <div>
                    <h6 className="card-subtitle text-muted mb-1 text-uppercase fw-semibold" style={{ fontSize: "0.75rem" }}>Pending Review</h6>
                    <h3 className="card-title mb-0 fw-bold">{pendingCount}</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row g-4">
            {/* Left Column - Category & Rating breakdown */}
            <div className="col-lg-6">
              {/* Category Breakdown Card */}
              <div className="card shadow-sm border-0 bg-white mb-4">
                <div className="card-body">
                  <h5 className="card-title fw-bold text-dark mb-4">Category Breakdown</h5>
                  {categoryData.length === 0 ? (
                    <div className="text-center py-4 text-muted">No category data for this timeframe.</div>
                  ) : (
                    <div className="row align-items-center">
                      <div className="col-sm-6 text-center d-flex justify-content-center mb-3 mb-sm-0">
                        {/* Interactive SVG Donut */}
                        <div style={{ position: "relative", width: "160px", height: "160px" }}>
                          <svg width="100%" height="100%" viewBox="0 0 140 140">
                            {/* Empty background circle */}
                            <circle cx="70" cy="70" r={donutRadius} fill="transparent" stroke="#f1f3f5" strokeWidth="15" />
                            {categoryData.map((item, index) => {
                              const strokeDashoffset = donutCircumference - (item.percentage / 100) * donutCircumference;
                              const currentStartAngle = cumulativePercentage;
                              cumulativePercentage += (item.percentage / 100) * 360;

                              const isHovered = hoveredCategory === item.key;

                              return (
                                <circle
                                  key={item.key}
                                  cx="70"
                                  cy="70"
                                  r={donutRadius}
                                  fill="transparent"
                                  stroke={item.color}
                                  strokeWidth={isHovered ? 20 : 15}
                                  strokeDasharray={donutCircumference}
                                  strokeDashoffset={strokeDashoffset}
                                  transform={`rotate(${currentStartAngle - 90} 70 70)`}
                                  style={{
                                    transition: "all 0.3s ease",
                                    cursor: "pointer",
                                  }}
                                  onMouseEnter={() => setHoveredCategory(item.key)}
                                  onMouseLeave={() => setHoveredCategory(null)}
                                />
                              );
                            })}
                          </svg>
                          {/* Centered tooltip details */}
                          <div
                            style={{
                              position: "absolute",
                              top: "50%",
                              left: "50%",
                              transform: "translate(-50%, -50%)",
                              textAlign: "center",
                              width: "100px",
                              pointerEvents: "none",
                            }}
                          >
                            {hoveredCategory ? (
                              <>
                                <h6
                                  className="mb-0 fw-bold"
                                  style={{
                                    color: categoryConfig[hoveredCategory].color,
                                    fontSize: "0.85rem",
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                  }}
                                >
                                  {categoryConfig[hoveredCategory].label}
                                </h6>
                                <span className="fs-5 fw-bold text-dark">
                                  {categoryData.find((d) => d.key === hoveredCategory)?.percentage}%
                                </span>
                                <div className="text-muted" style={{ fontSize: "0.7rem" }}>
                                  ({categoryData.find((d) => d.key === hoveredCategory)?.count} items)
                                </div>
                              </>
                            ) : (
                              <>
                                <span className="text-muted" style={{ fontSize: "0.75rem" }}>Categories</span>
                                <h4 className="mb-0 fw-bold text-dark">{categoryData.length}</h4>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Legend List */}
                      <div className="col-sm-6">
                        <ul className="list-unstyled mb-0">
                          {categoryData.map((item) => (
                            <li
                              key={item.key}
                              className="d-flex align-items-center justify-content-between py-2 border-bottom"
                              style={{
                                cursor: "pointer",
                                opacity: hoveredCategory && hoveredCategory !== item.key ? 0.5 : 1,
                                transition: "opacity 0.2s ease",
                                backgroundColor: hoveredCategory === item.key ? "#f8f9fa" : "transparent",
                                borderRadius: "4px",
                                padding: "0 8px",
                              }}
                              onMouseEnter={() => setHoveredCategory(item.key)}
                              onMouseLeave={() => setHoveredCategory(null)}
                            >
                              <div className="d-flex align-items-center">
                                <span
                                  className="d-inline-block rounded-circle me-2"
                                  style={{ width: "12px", height: "12px", backgroundColor: item.color }}
                                />
                                <span className="text-secondary" style={{ fontSize: "0.9rem" }}>
                                  {item.label}
                                </span>
                              </div>
                              <span className="fw-semibold text-dark" style={{ fontSize: "0.9rem" }}>
                                {item.count} ({item.percentage}%)
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Rating Distribution Card */}
              <div className="card shadow-sm border-0 bg-white">
                <div className="card-body">
                  <h5 className="card-title fw-bold text-dark mb-4">Rating Distribution</h5>
                  <div className="d-flex flex-column gap-3">
                    {ratingDistribution.map((item) => (
                      <div key={item.stars} className="d-flex align-items-center">
                        <span className="text-secondary fw-semibold me-2" style={{ width: "35px" }}>
                          {item.stars} ★
                        </span>
                        <div className="progress flex-grow-1" style={{ height: "10px", borderRadius: "5px", backgroundColor: "#e9ecef" }}>
                          <div
                            className="progress-bar bg-warning"
                            style={{
                              width: `${item.percentage}%`,
                              borderRadius: "5px",
                              transition: "width 1s cubic-bezier(0.1, 1, 0.1, 1)",
                            }}
                            role="progressbar"
                            aria-valuenow={item.percentage}
                            aria-valuemin="0"
                            aria-valuemax="100"
                          />
                        </div>
                        <span className="text-secondary fw-semibold ms-3 text-end" style={{ width: "70px", fontSize: "0.85rem" }}>
                          {item.count} ({item.percentage}%)
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Submission Trends */}
            <div className="col-lg-6">
              <div className="card shadow-sm border-0 bg-white h-100">
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title fw-bold text-dark mb-2">Submission Trends</h5>
                  <p className="card-subtitle text-muted mb-4" style={{ fontSize: "0.85rem" }}>
                    {timeframe === "all" ? "Feedback submission frequency by month" : "Feedback submission frequency by day"}
                  </p>

                  {trendData.length < 2 ? (
                    <div className="d-flex align-items-center justify-content-center flex-grow-1 text-muted">
                      Not enough timeline data to draw trend lines yet. Submit more feedbacks over different days!
                    </div>
                  ) : (
                    <div className="flex-grow-1 d-flex flex-column justify-content-center align-items-center">
                      <div style={{ position: "relative", width: "100%", maxWidth: "500px", height: "240px" }}>
                        {/* SVG Spline Trend Chart */}
                        <svg width="100%" height="180" viewBox={`0 0 ${chartWidth} ${chartHeight}`} preserveAspectRatio="none">
                          <defs>
                            {/* Area Gradient */}
                            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#0d6efd" stopOpacity="0.4" />
                              <stop offset="100%" stopColor="#0d6efd" stopOpacity="0.0" />
                            </linearGradient>
                            {/* Line Drop Shadow */}
                            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                              <feGaussianBlur stdDeviation="3" result="blur" />
                              <feComposite in="SourceGraphic" in2="blur" operator="over" />
                            </filter>
                          </defs>

                          {/* Grid Lines */}
                          <line x1={paddingX} y1={paddingY} x2={chartWidth - paddingX} y2={paddingY} stroke="#f1f3f5" strokeWidth="1" />
                          <line x1={paddingX} y1={(chartHeight - paddingY + paddingY) / 2} x2={chartWidth - paddingX} y2={(chartHeight - paddingY + paddingY) / 2} stroke="#f1f3f5" strokeWidth="1" />
                          <line x1={paddingX} y1={chartHeight - paddingY} x2={chartWidth - paddingX} y2={chartHeight - paddingY} stroke="#dee2e6" strokeWidth="1.5" />

                          {/* Gradient Filled Spline Area */}
                          <path d={getTrendAreaPath()} fill="url(#areaGradient)" />

                          {/* Spline Border Line */}
                          <path d={getTrendPath()} fill="none" stroke="#0d6efd" strokeWidth="3" filter="url(#glow)" strokeLinecap="round" />

                          {/* Interactive Trend Points */}
                          {trendPoints.map((p, i) => (
                            <g key={i}>
                              {/* Invisible mouse catcher */}
                              <circle
                                cx={p.x}
                                cy={p.y}
                                r="12"
                                fill="transparent"
                                style={{ cursor: "pointer" }}
                                onMouseEnter={() => setHoveredTrendPoint(i)}
                                onMouseLeave={() => setHoveredTrendPoint(null)}
                              />
                              {/* Inner visual point */}
                              <circle
                                cx={p.x}
                                cy={p.y}
                                r={hoveredTrendPoint === i ? "6" : "4"}
                                fill="#ffffff"
                                stroke="#0d6efd"
                                strokeWidth={hoveredTrendPoint === i ? "3.5" : "2.5"}
                                style={{ transition: "all 0.15s ease", pointerEvents: "none" }}
                              />
                            </g>
                          ))}
                        </svg>

                        {/* Chart X-axis Labels */}
                        <div
                          className="d-flex justify-content-between px-3 text-muted mt-2"
                          style={{ fontSize: "0.75rem", width: "100%", borderTop: "1px solid #e9ecef", paddingTop: "6px" }}
                        >
                          <span>{trendData[0]?.label}</span>
                          <span>{trendData[Math.floor(trendData.length / 2)]?.label}</span>
                          <span>{trendData[trendData.length - 1]?.label}</span>
                        </div>

                        {/* Floating Tooltip */}
                        {hoveredTrendPoint !== null && trendPoints[hoveredTrendPoint] && (
                          <div
                            style={{
                              position: "absolute",
                              left: `${(trendPoints[hoveredTrendPoint].x / chartWidth) * 100}%`,
                              top: `${(trendPoints[hoveredTrendPoint].y / chartHeight) * 100 - 25}%`,
                              transform: "translate(-50%, -100%)",
                              backgroundColor: "#343a40",
                              color: "#ffffff",
                              padding: "4px 8px",
                              borderRadius: "4px",
                              fontSize: "0.75rem",
                              whiteSpace: "nowrap",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
                              zIndex: 10,
                              pointerEvents: "none",
                              transition: "left 0.15s ease, top 0.15s ease"
                            }}
                          >
                            <strong>{trendPoints[hoveredTrendPoint].label}</strong>: {trendPoints[hoveredTrendPoint].count} feedbacks
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default FeedBackStats;
