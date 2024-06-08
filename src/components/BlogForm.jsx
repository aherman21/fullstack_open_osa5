// not in use yet

const blogForm = () => {
    return (
    <form onSubmit={addBlog}>
        <h2>create new</h2>
        <input value={newNote} onChange={handleBlogChange} />
        <button type="submit">savee</button>
    </form>
)}
export default blogForm