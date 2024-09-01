import { useState } from 'react'
import blogService from '../services/blogs'



const Blog = ({ blog, updateBlog }) => {
  const [detailsVisible, setDetailsVisible] = useState(false)
  const [likes, setLikes] = useState(blog.likes)

  const showWhenDetailsVisible = { display: detailsVisible ? '' : 'none' }

  const toggleDetailVisibility = () => {
    setDetailsVisible(!detailsVisible)
  }



  const incrementLike = async () => {
    const updatedBlog = { ...blog, likes: likes + 1 }
    const returnedBlog = await blogService.like(blog.id, updatedBlog)
    console.log(blog)
    setLikes(returnedBlog.likes)
    updateBlog({ ...returnedBlog, user: blog.user }) //call the function to update in the parent components state
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  return (
    <div style={blogStyle}>
      {blog.title} {blog.author}
      <button onClick={toggleDetailVisibility}>{detailsVisible ? 'hide' : 'show'}</button>
      <div style={showWhenDetailsVisible}>
        {blog.url}
      </div>
      <div style={showWhenDetailsVisible}>
        {blog.user ? blog.user.username : 'unknown user'}
      </div>

      <div style={showWhenDetailsVisible}>
        likes {blog.likes}
        <button onClick={incrementLike}>like</button>
      </div>
    </div>

  )
}

export default Blog