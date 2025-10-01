const contentful = require('contentful');
const fs = require('fs');
const path = require('path');

// Load environment variables from .env file
require('dotenv').config();


// Konfiguracja Contentful - używaj zmiennych środowiskowych
const client = contentful.createClient({
  space: process.env.CONTENTFUL_SPACE_ID,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN
});

// Funkcja do kopiowania folderów rekurencyjnie
function copyFolderSync(from, to) {
  if (!fs.existsSync(to)) {
    fs.mkdirSync(to);
  }
  
  fs.readdirSync(from).forEach(element => {
    const fromPath = path.join(from, element);
    const toPath = path.join(to, element);
    
    if (fs.lstatSync(fromPath).isFile()) {
      fs.copyFileSync(fromPath, toPath);
    } else {
      copyFolderSync(fromPath, toPath);
    }
  });
}

async function buildSite() {
  try {
    console.log('🚀 Rozpoczynam build strony barbershop...');
    
    // Pobierz dane z Contentful dla typu 'barbershop'
    const barbershopData = await client.getEntries({ content_type: 'barbershop' });
    
    if (barbershopData.items.length === 0) {
      throw new Error('Nie znaleziono danych typu "barbershop" w Contentful');
    }
    
    const data = barbershopData.items[0].fields;
    console.log('📋 Pobrano dane z Contentful');
    
    // Funkcja do obsługi obrazków z Contentful
    function getImageUrl(imageField) {
      if (!imageField) return '';
      if (typeof imageField === 'string') return imageField; // Jeśli to już URL
      if (imageField.fields && imageField.fields.file) {
        return 'https:' + imageField.fields.file.url;
      }
      return '';
    }
    
    // Wczytaj template HTML
    let html = fs.readFileSync('index.html', 'utf8');
    console.log('📄 Wczytano template HTML');
    
    // Zastąp wszystkie placeholdery danymi z Contentful
    // Hero section
    html = html.replace(/\{\{CMS:barbershop\.herotitle\}\}/g, data.herotitle || '');
    html = html.replace(/\{\{CMS:barbershop\.herosubtitle\}\}/g, data.herosubtitle || '');
    html = html.replace(/\{\{CMS:barbershop\.slider1description\}\}/g, data.slider1description || '');
    html = html.replace(/\{\{CMS:barbershop\.heroimage\}\}/g, getImageUrl(data.heroimage));
    
    // Slider images and content
    html = html.replace(/\{\{CMS:barbershop\.slider2image\}\}/g, getImageUrl(data.slider2image));
    html = html.replace(/\{\{CMS:barbershop\.slider2subtitle\}\}/g, data.slider2subtitle || '');
    html = html.replace(/\{\{CMS:barbershop\.slider2title\}\}/g, data.slider2title || '');
    html = html.replace(/\{\{CMS:barbershop\.slider2description\}\}/g, data.slider2description || '');
    
    html = html.replace(/\{\{CMS:barbershop\.slider3image\}\}/g, getImageUrl(data.slider3image));
    html = html.replace(/\{\{CMS:barbershop\.slider3subtitle\}\}/g, data.slider3subtitle || '');
    html = html.replace(/\{\{CMS:barbershop\.slider3title\}\}/g, data.slider3title || '');
    html = html.replace(/\{\{CMS:barbershop\.slider3description\}\}/g, data.slider3description || '');
    
    html = html.replace(/\{\{CMS:barbershop\.slider4image\}\}/g, getImageUrl(data.slider4image));
    html = html.replace(/\{\{CMS:barbershop\.slider4subtitle\}\}/g, data.slider4subtitle || '');
    html = html.replace(/\{\{CMS:barbershop\.slider4title\}\}/g, data.slider4title || '');
    html = html.replace(/\{\{CMS:barbershop\.slider4description\}\}/g, data.slider4description || '');
    
    // Parallax statistics
    html = html.replace(/\{\{CMS:barbershop\.parallax1number\}\}/g, data.parallax1number || '');
    html = html.replace(/\{\{CMS:barbershop\.parallax1text\}\}/g, data.parallax1text || '');
    html = html.replace(/\{\{CMS:barbershop\.parallax2number\}\}/g, data.parallax2number || '');
    html = html.replace(/\{\{CMS:barbershop\.parallax2text\}\}/g, data.parallax2text || '');
    html = html.replace(/\{\{CMS:barbershop\.parallax3number\}\}/g, data.parallax3number || '');
    html = html.replace(/\{\{CMS:barbershop\.parallax3text\}\}/g, data.parallax3text || '');
    html = html.replace(/\{\{CMS:barbershop\.parallax4number\}\}/g, data.parallax4number || '');
    html = html.replace(/\{\{CMS:barbershop\.parallax4text\}\}/g, data.parallax4text || '');
    
    // About section
    html = html.replace(/\{\{CMS:barbershop\.abouttitle\}\}/g, data.abouttitle || '');
    html = html.replace(/\{\{CMS:barbershop\.aboutdescription\}\}/g, data.aboutdescription || '');
    html = html.replace(/\{\{CMS:barbershop\.aboutimage\}\}/g, getImageUrl(data.aboutimage));
    
    // Services
    html = html.replace(/\{\{CMS:barbershop\.service1name\}\}/g, data.service1name || '');
    html = html.replace(/\{\{CMS:barbershop\.service1description\}\}/g, data.service1description || '');
    html = html.replace(/\{\{CMS:barbershop\.service1price\}\}/g, data.service1price || '');
    html = html.replace(/\{\{CMS:barbershop\.service2name\}\}/g, data.service2name || '');
    html = html.replace(/\{\{CMS:barbershop\.service2description\}\}/g, data.service2description || '');
    html = html.replace(/\{\{CMS:barbershop\.service2price\}\}/g, data.service2price || '');
    html = html.replace(/\{\{CMS:barbershop\.service3name\}\}/g, data.service3name || '');
    html = html.replace(/\{\{CMS:barbershop\.service3description\}\}/g, data.service3description || '');
    html = html.replace(/\{\{CMS:barbershop\.service3price\}\}/g, data.service3price || '');
    html = html.replace(/\{\{CMS:barbershop\.service4name\}\}/g, data.service4name || '');
    html = html.replace(/\{\{CMS:barbershop\.service4description\}\}/g, data.service4description || '');
    html = html.replace(/\{\{CMS:barbershop\.service4price\}\}/g, data.service4price || '');
    html = html.replace(/\{\{CMS:barbershop\.service5name\}\}/g, data.service5name || '');
    html = html.replace(/\{\{CMS:barbershop\.service5description\}\}/g, data.service5description || '');
    html = html.replace(/\{\{CMS:barbershop\.service5price\}\}/g, data.service5price || '');
    html = html.replace(/\{\{CMS:barbershop\.service6name\}\}/g, data.service6name || '');
    html = html.replace(/\{\{CMS:barbershop\.service6description\}\}/g, data.service6description || '');
    html = html.replace(/\{\{CMS:barbershop\.service6price\}\}/g, data.service6price || '');
    html = html.replace(/\{\{CMS:barbershop\.service7name\}\}/g, data.service7name || '');
    html = html.replace(/\{\{CMS:barbershop\.service7description\}\}/g, data.service7description || '');
    html = html.replace(/\{\{CMS:barbershop\.service7price\}\}/g, data.service7price || '');
    html = html.replace(/\{\{CMS:barbershop\.service8name\}\}/g, data.service8name || '');
    html = html.replace(/\{\{CMS:barbershop\.service8description\}\}/g, data.service8description || '');
    html = html.replace(/\{\{CMS:barbershop\.service8price\}\}/g, data.service8price || '');
    html = html.replace(/\{\{CMS:barbershop\.service9name\}\}/g, data.service9name || '');
    html = html.replace(/\{\{CMS:barbershop\.service9description\}\}/g, data.service9description || '');
    html = html.replace(/\{\{CMS:barbershop\.service9price\}\}/g, data.service9price || '');
    html = html.replace(/\{\{CMS:barbershop\.service10name\}\}/g, data.service10name || '');
    html = html.replace(/\{\{CMS:barbershop\.service10description\}\}/g, data.service10description || '');
    html = html.replace(/\{\{CMS:barbershop\.service10price\}\}/g, data.service10price || '');
    
    // Team members
    html = html.replace(/\{\{CMS:barbershop\.teammember1name\}\}/g, data.teammember1name || '');
    html = html.replace(/\{\{CMS:barbershop\.teammember1role\}\}/g, data.teammember1role || '');
    html = html.replace(/\{\{CMS:barbershop\.teammember1image\}\}/g, getImageUrl(data.teammember1image));
    html = html.replace(/\{\{CMS:barbershop\.teammember2name\}\}/g, data.teammember2name || '');
    html = html.replace(/\{\{CMS:barbershop\.teammember2role\}\}/g, data.teammember2role || '');
    html = html.replace(/\{\{CMS:barbershop\.teammember2image\}\}/g, getImageUrl(data.teammember2image));
    html = html.replace(/\{\{CMS:barbershop\.teammember3name\}\}/g, data.teammember3name || '');
    html = html.replace(/\{\{CMS:barbershop\.teammember3role\}\}/g, data.teammember3role || '');
    html = html.replace(/\{\{CMS:barbershop\.teammember3image\}\}/g, getImageUrl(data.teammember3image));
    
    // Gallery images
    html = html.replace(/\{\{CMS:barbershop\.galleryimage1\}\}/g, getImageUrl(data.galleryimage1));
    html = html.replace(/\{\{CMS:barbershop\.galleryimage2\}\}/g, getImageUrl(data.galleryimage2));
    html = html.replace(/\{\{CMS:barbershop\.galleryimage3\}\}/g, getImageUrl(data.galleryimage3));
    html = html.replace(/\{\{CMS:barbershop\.galleryimage4\}\}/g, getImageUrl(data.galleryimage4));
    html = html.replace(/\{\{CMS:barbershop\.galleryimage5\}\}/g, getImageUrl(data.galleryimage5));
    html = html.replace(/\{\{CMS:barbershop\.galleryimage6\}\}/g, getImageUrl(data.galleryimage6));
    html = html.replace(/\{\{CMS:barbershop\.galleryimage7\}\}/g, getImageUrl(data.galleryimage7));
    html = html.replace(/\{\{CMS:barbershop\.galleryimage8\}\}/g, getImageUrl(data.galleryimage8));
    html = html.replace(/\{\{CMS:barbershop\.galleryimage9\}\}/g, getImageUrl(data.galleryimage9));
    html = html.replace(/\{\{CMS:barbershop\.galleryimage10\}\}/g, getImageUrl(data.galleryimage10));
    html = html.replace(/\{\{CMS:barbershop\.galleryimage11\}\}/g, getImageUrl(data.galleryimage11));
    html = html.replace(/\{\{CMS:barbershop\.galleryimage12\}\}/g, getImageUrl(data.galleryimage12));
    
    // Contact information
    html = html.replace(/\{\{CMS:barbershop\.contactemail\}\}/g, data.contactemail || '');
    html = html.replace(/\{\{CMS:barbershop\.contactphone\}\}/g, data.contactphone || '');
    html = html.replace(/\{\{CMS:barbershop\.contactaddress\}\}/g, data.contactaddress || '');
    html = html.replace(/\{\{CMS:barbershop\.facebookurl\}\}/g, data.facebookurl || '');
    html = html.replace(/\{\{CMS:barbershop\.instagramurl\}\}/g, data.instagramurl || '');
    
    console.log('🔄 Zastąpiono wszystkie placeholdery');
    
    // Utwórz folder dist jeśli nie istnieje
    if (!fs.existsSync('dist')) {
      fs.mkdirSync('dist');
    }
    
    // Skopiuj wszystkie foldery (vendor, barber)
    console.log('📁 Kopiuję foldery vendor i barber...');
    copyFolderSync('vendor', 'dist/vendor');
    copyFolderSync('barber', 'dist/barber');
    
    // Zapisz finalny HTML
    fs.writeFileSync('dist/index.html', html);
    
    console.log('✅ Build zakończony pomyślnie!');
    console.log('📁 Pliki zapisane w folderze dist/');
    console.log('🌐 Strona gotowa do wdrożenia na Netlify');
    
  } catch (error) {
    console.error('❌ Błąd podczas build:', error);
    process.exit(1);
  }
}

buildSite();
