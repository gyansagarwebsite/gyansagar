import { useParams } from 'react-router-dom';
import BlogForm from '../components/BlogForm.jsx';

const EditBlog = () => {
  const { slug } = useParams();

  return (
    <div className='admin-page'>
      <div className='page-header'>
        <h2>Edit Blog Post</h2>
      </div>
      <main className='admin-main'>
        <BlogForm slug={slug} />
      </main>
    </div>
  );
};

export default EditBlog;
