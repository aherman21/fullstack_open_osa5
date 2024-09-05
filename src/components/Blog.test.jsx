import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

//5.13
test('renders only the title by default', () => {
  const blog = {
    title: 'testTitle',
    author: 'Matti the man',
    url: 'https://testtttttt.test',
    likes: 30
  }

  render(<Blog blog={blog} />)

  //check that title is visible
  const title = screen.getByText('testTitle')
  expect(title).toBeDefined()

  // Check that the author, url and likes are not visible
  const author = screen.queryByText('Matti the man')
  const url = screen.queryByText('https://testtttttt.test')
  const likes = screen.queryByText('30')

  expect(author).toBeNull()
  expect(url).toBeNull()
  expect(likes).toBeNull()
})

//5.14
test('renders the details when show button is clicked', async () => {
  const blog = {
    title: 'testTitle',
    author: 'Matti the man',
    url: 'https://testtttttt.test',
    likes: 30
  }

  const mockHandler = vi.fn()

  render(<Blog blog={blog} toggleDetailVisibility={mockHandler} />)

  const user = userEvent.setup()
  const button = screen.getByText('show')
  await user.click(button)

  const author = screen.getByText('author: Matti the man')
  const url = screen.getByText('url: https://testtttttt.test')
  const likes = screen.getByText('likes: 30')

  expect(author).toBeDefined()
  expect(url).toBeDefined()
  expect(likes).toBeDefined()
})

//5.15
test('if like button is pressed twice, the event handler is called twice', async () => {
  const blog = {
    title: 'testTitle',
    author: 'Matti the man',
    url: 'https://testtttttt.test',
    likes: 30
  }

  const mockHandler = vi.fn()

  render(<Blog blog={blog} incrementLike={mockHandler} />)

  const user = userEvent.setup()
  const button = screen.getByText('like')
  await user.click(button)
  await user.click(button)

  expect(mockHandler.mock.calls).toHaveLength(2)
})
