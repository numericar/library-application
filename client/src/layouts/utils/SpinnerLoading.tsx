const SpinerLoading = () => {
    return (
        <>
            <div className="container m-5 d-flex justify-content-center" style={{ height: 550 }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">
                        <p>Loading...</p>
                    </span>
                </div>
            </div>
        </>
    )
}

export default SpinerLoading;