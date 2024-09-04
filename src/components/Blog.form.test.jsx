import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'


//5.16
test('<BlogForm /> calls the callback function with correct data upon blog creation', async () => {
  const user = userEvent.setup()
  const createBlog = vi.fn()

  render(<BlogForm createBlog={createBlog} />)

  const title = screen.getByPlaceholderText('write title here')
  const author = screen.getByPlaceholderText('write author here')
  const url = screen.getByPlaceholderText('write url here')
  const sendButton = screen.getByText('save')

  await userEvent.type(title, 'testingTitle' )
  await userEvent.type(author, 'testingAuthor')
  await userEvent.type(url, 'testingUrl')
  await userEvent.click(sendButton)


  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0].title).toBe('testingTitle')
  expect(createBlog.mock.calls[0][0].author).toBe('testingAuthor')
  expect(createBlog.mock.calls[0][0].url).toBe('testingUrl')
})