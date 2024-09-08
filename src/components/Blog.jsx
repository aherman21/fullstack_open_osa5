import { useState } from 'react'
import blogService from '../services/blogs'



const Blog = ({ blog, updateBlog, incrementLike }) => {
  const [detailsVisible, setDetailsVisible] = useState(false)
  const [likes, setLikes] = useState(blog.likes)

  const showWhenDetailsVisible = { display: detailsVisible ? '' : 'none' }

  const toggleDetailVisibility = () => {
    setDetailsVisible(!detailsVisible)
  }



  const handleIncrementLike = async () => {
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
    <li className='blog' style={blogStyle} data-testid='blog'>
      {blog.title}
      <button onClick={toggleDetailVisibility}>{detailsVisible ? 'hide' : 'show'}</button>
      <div style={showWhenDetailsVisible}>
        url: {blog.url}
      </div>
      <div style={showWhenDetailsVisible}>
        posted by user: {blog.user ? blog.user.username : 'unknown user'}
      </div>
      <div style={showWhenDetailsVisible}>
        author: {blog.author}
      </div>
      <div style={showWhenDetailsVisible}>
        likes: {blog.likes}
        <button onClick={incrementLike || handleIncrementLike}>like</button>
      </div>
    </li>

  )
}

export default Blog