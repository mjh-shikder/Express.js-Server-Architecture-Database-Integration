const sendResponse = () => {
    res.status(500).json({
        success: false,
        message: error.message,
        error: error,
    });
};


export default sendResponse