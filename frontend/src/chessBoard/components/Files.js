import "./styles/Files.css";

const Files = ({ files }) => {
    const getChar = (i) => {
        return String.fromCharCode(i + 96);
    }

    return (
        <div className="files">
            {files.map((file) => {
                return <span key={file}>{getChar(file)}</span>;
            })}
        </div>
    );
}

export default Files