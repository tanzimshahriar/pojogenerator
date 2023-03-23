const Button = ({
    text,
    onClick,
    active,
}: {
    text: string;
    onClick: () => void;
    active: boolean;
}) => {
    return (
        <button
            className={`shadow-md py-2 px-4 rounded-sm ${
                active ? "bg-gray-600" : "bg-gray-800"
            }`}
            onClick={onClick}
        >
            {text}
        </button>
    );
};

export default Button;
