import BlogForm from '../components/BlogForm.jsx';

const AddBlog = () => {
  return (
    <div className='admin-page'>
      <div className='page-header'>
        <h2>Write New Blog Post</h2>
      </div>

      <main className='admin-main'>
        <BlogForm />
      </main>
    </div>
  );
};

export default AddBlog;
