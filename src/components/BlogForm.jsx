// not in use yet
import { useState } from 'react'




const BlogForm = ({ createBlog }) => {
  const [newBlogTitle, setNewBlogTitle] = useState('')
  const [newBlogAuthor, setNewBlogAuthor] = useState('')
  const [newBlogUrl, setNewBlogUrl] = useState('')

  const addBlog = (event) => {
    event.preventDefault()
    createBlog({
      title: newBlogTitle,
      author: newBlogAuthor,
      url: newBlogUrl
    })

    setNewBlogTitle('')
    setNewBlogAuthor('')
    setNewBlogUrl('')
  }
  return (
    <div>
      <h2>Create a new blog post</h2>

      <form onSubmit={addBlog}>
        <div>
            Title:
          <input
            value={newBlogTitle}
            onChange={event => setNewBlogTitle(event.target.value)}
          />
        </div>
        <div>
            Author:
          <input
            value={newBlogAuthor}
            onChange={event => setNewBlogAuthor(event.target.value)}
          />
        </div>
        <div>
            Url:
          <input
            value={newBlogUrl}
            onChange={event => setNewBlogUrl(event.target.value)}
          />
        </div>
        <button type="submit">save</button>
      </form>
    </div>
  )
}
export default BlogForm