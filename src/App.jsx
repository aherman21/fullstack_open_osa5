import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import LoginForm from './components/LoginForm'
import './App.css'

const App = () => {
  const [loginVisible, setLoginVisible] = useState(false)
  const [blogs, setBlogs] = useState([])
  const [newBlogTitle , setNewBlogTitle] = useState('')
  const [newBlogAuthor , setNewBlogAuthor] = useState('')
  const [newBlogUrl , setNewBlogUrl] = useState('')
  const [username, setUserName] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState(null)
  const [notificationType, setNotificationType] = useState(null)

  useEffect(() => {
    blogService
      .getAll()
      .then(blogs => {
      setBlogs(blogs)
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

  const addBlog = (event) => {
    event.preventDefault()
    const blogObject = {
      title: newBlogTitle,
      author: newBlogAuthor,
      url: newBlogUrl
    }

    blogService
      .create(blogObject)
        .then(returnedBlog => {
          setBlogs(blogs.concat(returnedBlog))
          showNotification(`A new blog ${returnedBlog.title} added!`, 'success')
        })
        .catch(error => {
          showNotification(`Failed to add blog: ${error}`, 'error')
        })
  }

  const deleteBlog = (id) => {
    if (window.confirm('Do you really want to delete this blog')) {
      blogService
        .remove(id)
        .then(() => {
          setBlogs(blogs.filter(blog => blog.id !== id))
          showNotification(`Blog deleted successfully`, 'success')
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
    const showWhenVisible = { display : loginVisible ? '' : 'none'}
    return (
      <div>
        <div style={hideWhenVisible}>
          <button onClick={() => setLoginVisible(true)}>log in</button>
        </div>
        <div style={showWhenVisible}>
          <LoginForm
            username={username}
            password={password}
            handleUsernameChange={handleUsernameChange}
            handlePasswordChange={handlePasswordChange}
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
  
  const blogForm = () => (
    <form onSubmit={addBlog}>
    <h2>create new</h2>
      <div>
        Title:
        <input
          value={newBlogTitle}
          onChange={({ target }) => setNewBlogTitle(target.value)}
        />
      </div>
      <div>
        Author:
        <input
          value={newBlogAuthor}
          onChange={({ target }) => setNewBlogAuthor(target.value)}
        />
      </div>
      <div>
        Url:
        <input
          value={newBlogUrl}
          onChange={({ target }) => setNewBlogUrl(target.value)}
        />
      </div>
      <button type="submit">save</button>
    </form>
  )
    

  return (
    <div>
      {notification && <div className={notificationType}>{notification}</div>}
      {!user && loginForm()}
      {user && <div>
      <p>{user.name} logged in</p>
      {logoutButton()}
      {blogForm()}
      <h2>blogs</h2>
      {blogs.map(blog =>
        <div>
        <Blog key={blog.id} blog={blog} />
        <button onClick={() => deleteBlog(blog.id)}>delete</button>
        </div>
      )}
      </div>}

      
      
    </div>
  )
}

export default App