import MaterialForm from '../components/MaterialForm.jsx';

const AddMaterial = () => {
  return (
    <div className="admin-page">
      <div className="page-header">
        <h2>Upload Study Material</h2>
      </div>
      <main className="admin-main">
        <MaterialForm />
      </main>
    </div>
  );
};

export default AddMaterial;

