const ErrorSpan = ({ error }) => {

    return (
        <span className="text-xs text-red-500 min-h-4">
            {error}
        </span>
    )
}

export { ErrorSpan }