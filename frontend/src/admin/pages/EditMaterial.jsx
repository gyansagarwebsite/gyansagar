import { useParams } from 'react-router-dom';
import MaterialForm from '../components/MaterialForm.jsx';

const EditMaterial = () => {
  const { id } = useParams();

  return (
    <div className="admin-page">
      <div className="page-header">
        <h2>Edit Study Material</h2>
      </div>
      <main className="admin-main">
        <MaterialForm materialId={id} />
      </main>
    </div>
  );
};

export default EditMaterial;
