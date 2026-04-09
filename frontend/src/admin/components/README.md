# Admin Panel Components

This directory contains all reusable UI components for the Gyan Sagar admin panel, built with React and styled using the design system CSS variables.

## Core Reusable Components

These components are designed to be reused across multiple pages and are ready for production use.

### Form Components

#### FormInput
- **File**: `FormInput.jsx` & `FormInput.css`
- **Purpose**: Accessible form input with validation feedback
- **Props**: label, type, value, onChange, error, required, disabled, hint, placeholder
- **Usage**: Text fields, email fields, password fields, number fields
- **Features**: Error display, required asterisk, focus states, disabled state

#### FormTextarea
- **File**: `FormTextarea.jsx` & `FormTextarea.css`
- **Purpose**: Multiline text input component
- **Props**: label, value, onChange, error, required, disabled, hint, rows, placeholder
- **Usage**: Long-form text, descriptions, content editing
- **Features**: Custom scrollbar, resizable, all FormInput features

#### FileUploader
- **File**: `FileUploader.jsx` & `FileUploader.css`
- **Purpose**: Drag-and-drop file upload
- **Props**: label, accept, maxSize, onFile, multiple, required, hint, error
- **Usage**: PDF uploads, image uploads, document uploads
- **Features**: Drag-drop, click upload, file preview, size validation, clear button

### Data Display Components

#### DataTable
- **File**: `DataTable.jsx` & `DataTable.css`
- **Purpose**: Reusable table for list pages
- **Props**: columns, data, actions, onSort, sortField, sortOrder, loading, emptyMessage
- **Usage**: Questions list, Materials list, Blogs list, Messages list
- **Features**: Sorting, custom cell rendering, action buttons, loading state, empty state

#### DashboardCard
- **File**: `DashboardCard.jsx` & `DashboardCard.css`
- **Purpose**: Stat card for dashboard metrics
- **Props**: icon, title, value, trend, subsidiary
- **Usage**: System statistics, metric displays
- **Features**: Entrance animation, hover lift effect, trend indicator, responsive sizing

## Layout Components

#### AdminHeader
- **File**: `AdminHeader.jsx` & `AdminHeader.css`
- **Purpose**: Top navigation bar with profile menu
- **Features**: Profile dropdown, logout confirmation, responsive mobile view
- **Status**: Fully implemented, ready to use

#### AdminDrawer
- **File**: `AdminDrawer.jsx` & `AdminDrawer.css`
- **Purpose**: Side navigation drawer
- **Features**: Slide-in animation, active page indicator, Lucide icons, logout button
- **Status**: Fully implemented, ready to use

#### AdminLayout
- **File**: `AdminLayout.jsx`
- **Purpose**: Main container combining header, drawer, and content
- **Features**: Manages drawer state, responsive layout
- **Status**: Fully implemented, ready to use

## Existing Components (Legacy)

These components already exist in the directory but are being phased out in favor of reusable components:

- `BlogForm.jsx` - Will be refactored to use FormInput, FormTextarea, FileUploader
- `MaterialForm.jsx` - Will be refactored to use FormInput, FormTextarea, FileUploader
- `QuestionForm.jsx` - Will be refactored to use FormInput, FormTextarea
- `StatCard.jsx` - Replaced by DashboardCard.jsx
- `EmptyState.jsx` - Can be wrapped with DashboardCard styling
- `LoadingSpinner.jsx` - Utility component for loading states
- `QuizQuestionPicker.jsx` - Specialized component for quiz questions

## Design System Integration

All components use CSS variables defined in `frontend/src/styles/design-system.css`:

- **Colors**: Primary (#2D3F8F), Accent (#FF8A3D), Success, Error, Warning, Info
- **Spacing**: 8px-based scale (xs 4px → 3xl 48px)
- **Typography**: 10 sizes with 5 weights
- **Shadows**: 6 elevation levels
- **Animations**: 3 speed presets with cubic-bezier easing
- **Responsive**: Breakpoints at 320px, 480px, 768px, 1024px, 1280px, 1536px

See `design-system.css` for complete variable reference.

## Usage Examples

### Simple Form Page
```jsx
import { useState } from 'react';
import FormInput from './FormInput';
import FormTextarea from './FormTextarea';

function CreateQuestion() {
  const [data, setData] = useState({ title: '', description: '' });

  return (
    <form>
      <FormInput 
        label="Title" 
        value={data.title} 
        onChange={(e) => setData({...data, title: e.target.value})}
        required
      />
      <FormTextarea 
        label="Description" 
        value={data.description} 
        onChange={(e) => setData({...data, description: e.target.value})}
        rows={5}
      />
      <button type="submit">Create</button>
    </form>
  );
}
```

### List CRUD Page
```jsx
import { useState } from 'react';
import DataTable from './DataTable';
import { Edit2, Trash2 } from 'lucide-react';

function QuestionsPage() {
  const [questions, setQuestions] = useState([]);

  const columns = [
    { field: 'title', label: 'Title' },
    { field: 'category', label: 'Category' },
    { field: 'createdAt', label: 'Created', render: (v) => new Date(v).toLocaleDateString() }
  ];

  const actions = [
    { 
      icon: <Edit2 size={16} />, 
      label: 'Edit',
      variant: 'primary',
      onClick: (row) => console.log('Edit:', row.id)
    },
    { 
      icon: <Trash2 size={16} />, 
      label: 'Delete',
      variant: 'danger',
      onClick: (row) => setQuestions(questions.filter(q => q.id !== row.id))
    }
  ];

  return <DataTable columns={columns} data={questions} actions={actions} />;
}
```

### Dashboard Stats
```jsx
import { Users, FileText, BookOpen } from 'lucide-react';
import DashboardCard from './DashboardCard';

function Dashboard() {
  return (
    <div className="stats-grid">
      <DashboardCard icon={<Users />} title="Students" value={1250} trend={12} />
      <DashboardCard icon={<FileText />} title="Questions" value={456} trend={8} />
      <DashboardCard icon={<BookOpen />} title="Materials" value={84} trend={-2} />
    </div>
  );
}
```

## Component File Size Reference

| Component | JSX | CSS | Total |
|-----------|-----|-----|-------|
| FormInput | 2 KB | 3 KB | 5 KB |
| FormTextarea | 1.5 KB | 2 KB | 3.5 KB |
| FileUploader | 3 KB | 3 KB | 6 KB |
| DataTable | 4 KB | 4 KB | 8 KB |
| DashboardCard | 1 KB | 2 KB | 3 KB |
| AdminHeader | 2 KB | 4 KB | 6 KB |
| AdminDrawer | 3 KB | 3 KB | 6 KB |
| **Total** | **16.5 KB** | **21 KB** | **37.5 KB** |

All files minified in production build.

## Documentation

For detailed API documentation, see [`COMPONENTS_API.md`](../COMPONENTS_API.md) in the project root.

For design system reference, see [`ADMIN_PANEL_UI_GUIDE.md`](../ADMIN_PANEL_UI_GUIDE.md).

## Next Steps

1. **Refactor CRUD Pages**: Update AdminQuestions, AdminMaterials, AdminBlogs to use DataTable
2. **Refactor Form Pages**: Update form components to use FormInput, FormTextarea, FileUploader
3. **Add Framer Motion**: Implement page entrance animations
4. **Integrate Form Validation**: Add react-hook-form for complex validation
5. **Add Toast Notifications**: Use react-toastify for user feedback

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari 12+, Chrome Mobile)

## Accessibility

All components meet WCAG 2.1 AA standards:
- Semantic HTML
- Proper label associations
- ARIA attributes
- Keyboard navigation
- Focus indicators
- Color contrast ≥ 4.5:1

## Support

For issues or questions:
1. Check `COMPONENTS_API.md` for detailed API documentation
2. Review component source code for implementation details
3. Check `design-system.css` for available CSS variables
4. Review example pages in `frontend/src/admin/pages/`
