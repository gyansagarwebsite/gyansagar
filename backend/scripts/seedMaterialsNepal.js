import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Material from '../src/models/Material.js';
import connectDB from '../src/config/db.js';
import '../src/utils/dnsSetup.js';

dotenv.config({ path: './backend/.env' });

const materials = [
  {
    title: 'नेपालको संविधान २०७२ (Constitution of Nepal)',
    description: 'नेपालको वर्तमान संविधानको आधिकारिक र पूर्ण पाठ (English Version). लोकसेवाको लागि अनिवार्य सामग्री।',
    pdfUrl: 'https://mofnepal.gov.np/storage/publication/1654854157_Constitution_of_Nepal_English.pdf',
    category: 'Constitution',
    thumbnail: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=200&auto=format&fit=crop'
  },
  {
    title: 'निजामती सेवा ऐन २०४९ (Civil Service Act)',
    description: 'लोकसेवा आयोगद्वारा सञ्चालित परीक्षाहरूका लागि आधारभूत ऐन। निजामती कर्मचारीको सेवा, सर्त र सुविधा।',
    pdfUrl: 'https://psc.gov.np/uploads/downloads/1502256191_Civil_Service_Act_2049.pdf',
    category: 'Loksewa',
    thumbnail: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=200&auto=format&fit=crop'
  },
  {
    title: 'स्थानीय सरकार सञ्चालन ऐन २०७४',
    description: 'स्थानीय तहको संरचना, कार्य र अधिकार सम्बन्धी जानकारी। संघीयता कार्यान्वयनको मुख्य ऐन।',
    pdfUrl: 'https://mofaga.gov.np/storage/publication/Local_Government_Operation_Act_2074.pdf',
    category: 'Loksewa',
    thumbnail: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=200&auto=format&fit=crop'
  },
  {
    title: 'नेपालको आर्थिक सर्वेक्षण २०७९/८०',
    description: 'नेपालको पछिल्लो आर्थिक अवस्था, जिडीपी, मुद्रास्फीति र औद्योगिक विकासको आधिकारिक विवरण।',
    pdfUrl: 'https://www.mof.gov.np/storage/publication/Economic_Survey_2079_80_Nepali.pdf',
    category: 'Other',
    thumbnail: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=200&auto=format&fit=crop'
  },
  {
    title: 'बजेट वक्तव्य २०८०/८१ (Budget Speech)',
    description: 'नयाँ आर्थिक वर्षको लागि सरकारको नीति, योजना र बजेट विनियोजनको पूर्ण वक्तव्य।',
    pdfUrl: 'https://www.mof.gov.np/storage/publication/Budget_Speech_2080_81_Nepali.pdf',
    category: 'Other',
    thumbnail: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?q=80&w=200&auto=format&fit=crop'
  },
  {
    title: 'राष्ट्रिय मानव अधिकार ऐन २०६८',
    description: 'मानव अधिकारको संरक्षण र प्रवर्द्धन गर्ने सम्बन्धी महत्वपूर्ण कानुनी व्यवस्था।',
    pdfUrl: 'https://www.nhrcnepal.org/uploads/publication/HR_Act_2068_Nepali.pdf',
    category: 'Loksewa',
    thumbnail: 'https://images.unsplash.com/photo-1460518451285-cd7bcaf19591?q=80&w=200&auto=format&fit=crop'
  },
  {
    title: 'सूचनाको हकसम्बन्धी ऐन २०६४',
    description: 'पारदर्शिता र उत्तरदायित्वका लागि सूचनाको हक कार्यान्वयन गर्ने सम्बन्धी ऐन।',
    pdfUrl: 'https://www.nic.gov.np/storage/publication/Right_to_Information_Act_2064_Nepali.pdf',
    category: 'Loksewa',
    thumbnail: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=200&auto=format&fit=crop'
  },
  {
    title: 'आन्तरिक लेखापरीक्षण निर्देशिका (Manual)',
    description: 'सरकारी कार्यालयहरूको आन्तरिक लेखापरीक्षणका कार्यविधि र मापदण्ड।',
    pdfUrl: 'https://www.mof.gov.np/storage/publication/Internal_Audit_Manual_Nepali.pdf',
    category: 'Other',
    thumbnail: 'https://images.unsplash.com/photo-1454165833222-d1d44d60ed4a?q=80&w=200&auto=format&fit=crop'
  },
  {
    title: 'सार्वजनिक खरिद ऐन २०६३',
    description: 'सरकारी खरिद प्रक्रिया, टेन्डर र बोलपत्र सम्बन्धी कानुनी प्रावधान।',
    pdfUrl: 'https://ppmo.gov.np/uploads/files/Public_Procurement_Act_2063.pdf',
    category: 'Loksewa',
    thumbnail: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=200&auto=format&fit=crop'
  },
  {
    title: 'शिक्षा ऐन २०२८ (Education Act)',
    description: 'नेपालको शिक्षा व्यवस्था र विद्यालय सञ्चालन सम्बन्धी आधारभूत ऐन। शिक्षक सेवाको लागि अनिवार्य।',
    pdfUrl: 'https://moe.gov.np/storage/publication/Education_Act_2028_Nepali.pdf',
    category: 'Other',
    thumbnail: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=200&auto=format&fit=crop'
  }
];

const seedMaterials = async () => {
  try {
    await connectDB();
    
    // Clear existing
    await Material.deleteMany({});
    console.log('✅ Existing materials cleared.');
    
    // Seed new
    await Material.insertMany(materials);
    console.log('✅ 10 HIGH-QUALITY Real Nepal Loksewa Official Documents seeded successfully!');
    
    mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

seedMaterials();
