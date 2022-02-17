import { screen, render } from '@testing-library/react'
import Posts, { getStaticProps } from '../../pages/posts'
import { getPrismicClient } from '../../services/prismic'
import { mocked } from 'jest-mock'

jest.mock('../../services/prismic')

const posts = [
  { slug: 'my-new-post', title: 'new post', excerpt: 'Post excerpt', updatedAt: '10 de Abril'}
]

describe('Posts page', () => {
  it('renders correctly', () => {
    render(
      <Posts posts={posts} />
    )
    expect(screen.getByText('new post')).toBeInTheDocument()
    expect(screen.getByText('Post excerpt')).toBeInTheDocument()
    expect(screen.getByText('10 de Abril')).toBeInTheDocument()
  })

  it('loads initial data', async () => {
    const getPrismicClientMocked = mocked(getPrismicClient)

    getPrismicClientMocked.mockReturnValueOnce({
      query: jest.fn().mockResolvedValueOnce({
        results: [
          {
            uid: 'my-new-post',
            data: {
              title: [
                { type: 'heading', text: 'My new post'}
              ],
              content: [
                { type: 'paragraph', text: 'post excerpt' }
              ],
            },
            last_publication_date: '04-01-2021',
          }
        ]
      })
    } as any)

    const response =  await getStaticProps({})

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          posts: [{
            slug: 'my-new-post', 
            title: 'My new post',
            excerpt: 'post excerpt',
            updatedAt: '01 de abril de 2021'
          }]
        }
      })
    )
  })
})