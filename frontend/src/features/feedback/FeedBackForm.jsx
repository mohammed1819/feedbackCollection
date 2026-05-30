import { useState } from 'react';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import ReactStars from 'react-rating-star-with-type';
import { useNavigate } from 'react-router-dom';

const FeedBackForm = () => {
    const navigate = useNavigate();
    const axiosPrivate = useAxiosPrivate();

    const [category, setCategory] = useState([]);
    const [star, setStar] = useState(5);
    const [message, setMessage] = useState('');

    const submitFeedBack = async (e) => {
        e.preventDefault();
        try {
            const response = await axiosPrivate.post('/feedback', {
                message,
                rating: star,
                category,
            });
            if (response?.data?.result) {
                console.log('feedback sent');
            }
            navigate('/dashboard');
        } catch (err) {
            console.log(err?.response || err);
        }
    };

    const categoryChange = (e) => {
        const value = e.target.value;
        if (e.target.checked) {
            setCategory((prev) => [...prev, value]);
        } else {
            setCategory((prev) => prev.filter((item) => item !== value));
        }
    };

    const onChange = (nextValue) => {
        setStar(nextValue);
    };

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-md-8 col-lg-6">
                    <div className="card shadow-sm">
                        <div className="card-body">
                            <h2 className="text-center mb-4">Feedback Form</h2>
                            <form onSubmit={submitFeedBack}>

                                <div className="mb-3">
                                    <label htmlFor="message" className="form-label">Message</label>
                                    <textarea
                                        id="message"
                                        className="form-control"
                                        rows={4}
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        placeholder="Write your feedback..."
                                        required
                                    />
                                </div>


                                <div className="mb-3">
                                    <label className="form-label d-block">Select Categories</label>
                                    {['bug', 'feature-request', 'ui', 'content', 'other'].map((cat) => (
                                        <div className="form-check form-check-inline" key={cat}>
                                            <input
                                                type="checkbox"
                                                className="form-check-input"
                                                id={cat}
                                                value={cat}
                                                onChange={categoryChange}
                                            />
                                            <label className="form-check-label" htmlFor={cat}>
                                                {cat.replace('-', ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                                            </label>
                                        </div>
                                    ))}
                                </div>


                                <div className="mb-3">
                                    <label className="form-label d-block">Rate your experience</label>
                                    <ReactStars
                                        onChange={onChange}
                                        value={star}
                                        isEdit={true}
                                        activeColors={['red', 'orange', '#FFCE00', '#9177FF', '#8568FC']}
                                        valueShow={true}
                                        isHalf={true}
                                        size={32}
                                    />
                                </div>


                                <div className="d-grid">
                                    <button className="btn btn-primary" type="submit">
                                        Submit Feedback
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default FeedBackForm
