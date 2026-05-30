const logout = (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) {
        return res.status(200).json({ message: 'Already Logged Out' });
    }

    try {
        res.clearCookie('jwt', {
            httpOnly: true,
            sameSite: 'none',
            secure: process.env.NODE_ENV === 'production'
        });
        return res.status(200).json({ message: 'Cookie cleared successfully' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Failed to clear cookie' });
    }
}
module.exports = {logout}