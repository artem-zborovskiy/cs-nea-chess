import './Files.css'

const Files = ({ files }) => {
    return <div className="files">
        {files.map((file) => {
            return <span key={file}>{file}</span>
        })}
    </div>
}

export default Files