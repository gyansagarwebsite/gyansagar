import HeroSection from '../components/HeroSection';
import TodayQuestion from '../components/TodayQuestion';
import PracticeByCategory from '../components/PracticeByCategory';
import StudyMaterials from '../components/StudyMaterials';
import BlogSection from '../components/BlogSection';
import WeeklyQuiz from '../components/WeeklyQuiz';
import Footer from '../components/Footer';

const Home = () => {
  return (
    <>
      <HeroSection />
      <TodayQuestion />
      <section className="home-practice-section" style={{ backgroundColor: '#fdfdfd' }}>
        <PracticeByCategory />
      </section>
      <StudyMaterials />
      <BlogSection />
      <WeeklyQuiz />
      <Footer />
    </>
  );
};

export default Home;
