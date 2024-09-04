import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import blogService from './services/blogs'
import loginService from './services/login'
import LoginForm from './components/LoginForm'
import './App.css'
import Togglable from './components/Togglable'

const App = () => {
  const [loginVisible, setLoginVisible] = useState(false)
  const [blogs, setBlogs] = useState([])
  const [username, setUserName] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState(null)
  const [notificationType, setNotificationType] = useState(null)

  useEffect(() => {
    blogService
      .getAll()
      .then(blogs => {
        const sortedBlogs = blogs.sort((a, b) => b.likes - a.likes)
        setBlogs(sortedBlogs)
      })
  }, [])

  useEffect(() => {
    const loggedUserJson = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJson) {
      const user = JSON.parse(loggedUserJson)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  //this is to update the existing blogs in realtime i.e when pressing like button
  const updateBlogs = (updatedBlog) => {
    const updatedBlogs = blogs.map(blog => (blog.id === updatedBlog.id ? updatedBlog : blog))
    const sortedBlogs = updatedBlogs.sort((a, b) => b.likes - a.likes)
    setBlogs(sortedBlogs)
    console.log(user)
  }

  const addBlog = (blogObject) => {
    blogFormRef.current.toggleVisibility()
    blogService
      .create(blogObject)
      .then(returnedBlog => {
        const updatedBlogs = blogs.concat({ ...returnedBlog, user: user })
        const sortedBlogs = updatedBlogs.sort((a, b) => b.likes - a.likes)
        setBlogs(sortedBlogs)
      })
  }

  const deleteBlog = (id) => {
    if (window.confirm('Do you really want to delete this blog')) {
      blogService
        .remove(id)
        .then(() => {
          const updatedBlogs = blogs.filter(blog => blog.id !== id)
          const sortedBlogs = updatedBlogs.sort((a, b) => b.likes - a.likes)
          setBlogs(sortedBlogs)
          showNotification('Blog deleted successfully', 'success')
        })
        .catch(error => {
          showNotification(`Failed to delete blog: ${error.message}`, 'error')
        })
    }
  }

  const showNotification = (message, type) => {
    setNotification(message)
    setNotificationType(type)
    setTimeout(() => {
      setNotification(null)
      setNotificationType(null)
    }, 3000)
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password,
      })

      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )

      blogService.setToken(user.token)
      showNotification(`logging in as ${user.username} succeeded`, 'success')
      setUser(user)
      setUserName('')
      setPassword('')
    } catch (exception) {
      console.log('Wrong credentials')
      setTimeout(() => {
        showNotification('Wrong username or password', 'error')
      }, 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
  }

  const loginForm = () => {
    const hideWhenVisible = { display : loginVisible ? 'none' : '' }
    const showWhenVisible = { display : loginVisible ? '' : 'none' }
    return (
      <div>
        <div style={hideWhenVisible}>
          <button onClick={() => setLoginVisible(true)}>log in</button>
        </div>
        <div style={showWhenVisible}>
          <LoginForm
            username={username}
            password={password}
            handleUsernameChange={({ target }) => setUserName(target.value)}
            handlePasswordChange={({ target }) => setPassword(target.value)}
            handleSubmit={handleLogin}
          />
          <button onClick={() => setLoginVisible(false)}>cancel</button>
        </div>
      </div>
    )

  }

  const logoutButton = () => (
    <button onClick={handleLogout}>logout</button>
  )

  const blogFormRef = useRef()



  return (
    <div>
      {notification && <div className={notificationType}>{notification}</div>}
      {!user && loginForm()}
      {user && <div>
        <p>{user.name} logged in</p>
        {logoutButton()}
        <Togglable buttonLabel='new blog' ref={blogFormRef}>
          <BlogForm createBlog={addBlog} />
        </Togglable>
        <h2>blogs</h2>

        {blogs.map(blog =>
          <>
            <Blog key={blog.id} blog={blog} updateBlog={updateBlogs} />
            {blog.user && blog.user.username === user.username && (
              <button onClick={() => deleteBlog(blog.id)}>delete</button>
            )}
          </>
        )}
      </div>}




    </div>
  )
}

export default App