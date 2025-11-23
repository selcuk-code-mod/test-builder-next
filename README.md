# Test Builder - Professional Drag & Drop Page Builder

Test Builder is a modern, powerful, and responsive drag-and-drop page builder built with **Next.js 15**, **React 19**, and **Tailwind CSS v4**. It allows users to visually construct web page layouts using a variety of customizable elements, manage themes, and export their designs as JSON.

![Test Builder Preview](https://via.placeholder.com/1200x600?text=Test+Builder+Preview)

## 🚀 Key Features

### 🎨 Visual Editor
- **Drag & Drop Interface**: Intuitive canvas for placing and arranging elements.
- **Grid System**: Optional grid overlay with snap-to-grid functionality for precise alignment.
- **Multi-Viewport Support**: Switch between **Desktop**, **Tablet**, and **Mobile** views.
  - **Automatic Mobile Stacking**: Elements automatically stack vertically on mobile screens (<600px) for better readability.
- **Zoom Controls**: Zoom in/out to navigate large layouts with ease.

### 🧩 Rich Element Library
- **Header**: Customizable navigation bars with logo and links.
- **Footer**: Footer sections with copyright and link management.
- **Card**: Content cards with title, description, and image support.
- **Text**: Rich text blocks for content.
- **Slider**: Interactive image sliders with:
  - Image upload support (Drag & drop or file selection)
  - Automatic image compression and optimization
  - Base64 storage for portability
  - Slide navigation and indicators

### 🛠️ Advanced Customization
- **Element Toolbar**: Floating toolbar for quick actions (Edit, Layering, Delete).
- **Settings Modal**: Detailed editing window for selected elements:
  - **Layout**: Position (X, Y) and Size (Width, Height).
  - **Content**: Edit text, links, and images directly.
  - **Images**: Upload and manage slider/card images.

### 🌓 Theme System
- **Dark/Light Mode**: Fully integrated theme system with:
  - One-click toggle in the toolbar.
  - System preference detection.
  - `localStorage` persistence.
  - Smooth color transitions.
  - Tailwind CSS v4 class-based dark mode.

### 💾 Data Management
- **JSON Import/Export**: 
  - Save your work locally as JSON.
  - Import existing layouts.
  - **Smart Import**: Supports multiple JSON schemas with automatic conversion.
- **Keyboard Shortcuts**:
  - `Ctrl + Z`: Undo
  - `Ctrl + Y` / `Ctrl + Shift + Z`: Redo
  - `Ctrl + D`: Duplicate selected element
  - `Delete` / `Backspace`: Remove selected element

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **UI Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Drag & Drop**: [react-dnd](https://react-dnd.github.io/react-dnd/)
- **Icons**: [react-icons](https://react-icons.github.io/react-icons/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)

## 📦 Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/yourusername/test-builder-next.git
    cd test-builder-next
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    pnpm install
    # or
    yarn install
    ```

3.  **Run the development server:**
    ```bash
    npm run dev
    # or
    pnpm run dev
    ```

4.  **Open your browser:**
    Navigate to [http://localhost:3000](http://localhost:3000) to start building!

## 🎮 Usage Guide

1.  **Adding Elements**: Drag an element (e.g., "Card") from the **Sidebar** on the left and drop it onto the **Canvas**.
2.  **Editing**: Click on any element to select it. Use the floating **Toolbar** or click "Edit" to open the **Settings Modal**.
3.  **Moving & Resizing**: Drag elements around the canvas. Use the property panel for precise sizing.
4.  **Responsive Check**: Use the device icons in the **Toolbar** (top) to switch viewports and verify how your layout adapts.
5.  **Dark Mode**: Click the Sun/Moon icon in the toolbar to toggle themes.
6.  **Saving**: Click the "Export" button in the toolbar to download your layout as a JSON file.

## 📂 Project Structure

```
test-builder-next/
├── app/
│   ├── components/         # UI Components
│   │   ├── elements/       # Builder Elements (Card, Slider, etc.)
│   │   ├── Canvas.tsx      # Main drawing area
│   │   ├── Canvas.tsx      # Main drawing area
│   │   ├── ElementSettingsModal.tsx # Settings popup
│   │   ├── Sidebar.tsx     # Left sidebar for tools
│   │   └── Toolbar.tsx     # Top bar for actions
│   ├── context/            # React Contexts (Builder, Theme)
│   ├── utils/              # Helpers (Validation, Image processing)
│   ├── globals.css         # Global styles & Tailwind config
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Main application page
├── public/                 # Static assets
└── ...config files
```



# 🇹🇷 Test Builder - Profesyonel Sürükle & Bırak Sayfa Oluşturucu

Test Builder, **Next.js 15**, **React 19** ve **Tailwind CSS v4** ile oluşturulmuş modern, güçlü ve responsive bir sürükle-bırak sayfa oluşturucusudur. Kullanıcıların çeşitli özelleştirilebilir elementleri kullanarak web sayfası düzenlerini görsel olarak oluşturmalarına, temaları yönetmelerine ve tasarımlarını JSON olarak dışa aktarmalarına olanak tanır.

![Test Builder Önizleme](https://via.placeholder.com/1200x600?text=Test+Builder+Preview)

## 🚀 Temel Özellikler

### 🎨 Görsel Editör
- **Sürükle & Bırak Arayüzü**: Elementleri yerleştirmek ve düzenlemek için sezgisel tuval.
- **Izgara Sistemi**: Hassas hizalama için ızgaraya yapışma özelliğine sahip isteğe bağlı ızgara katmanı.
- **Çoklu Görünüm Desteği**: **Masaüstü**, **Tablet** ve **Mobil** görünümleri arasında geçiş yapın.
  - **Otomatik Mobil Sıralama**: Mobil ekranlarda (<600px) elementler daha iyi okunabilirlik için otomatik olarak dikey sıralanır.
- **Yakınlaştırma Kontrolleri**: Büyük düzenlerde kolayca gezinmek için yakınlaştırıp uzaklaştırın.

### 🧩 Zengin Element Kütüphanesi
- **Header (Başlık)**: Logo ve bağlantılar içeren özelleştirilebilir gezinme çubukları.
- **Footer (Alt Bilgi)**: Telif hakkı ve bağlantı yönetimi içeren alt bilgi bölümleri.
- **Card (Kart)**: Başlık, açıklama ve görsel desteği olan içerik kartları.
- **Text (Metin)**: İçerik için zengin metin blokları.
- **Slider (Kaydırıcı)**: Aşağıdakileri içeren etkileşimli görsel kaydırıcılar:
  - Görsel yükleme desteği (Sürükle & bırak veya dosya seçimi)
  - Otomatik görsel sıkıştırma ve optimizasyon
  - Taşınabilirlik için Base64 depolama
  - Slayt navigasyonu ve göstergeleri

### 🛠️ Gelişmiş Özelleştirme
- **Element Araç Çubuğu**: Hızlı işlemler için yüzen araç çubuğu (Düzenle, Katmanlama, Sil).
- **Ayarlar Modalı**: Seçilen elementler için detaylı düzenleme penceresi:
  - **Düzen**: Konum (X, Y) ve Boyut (Genişlik, Yükseklik).
  - **İçerik**: Metni, bağlantıları ve görselleri doğrudan düzenleyin.
  - **Görseller**: Slider/Kart görsellerini yükleyin ve yönetin.

### 🌓 Tema Sistemi
- **Karanlık/Aydınlık Modu**: Tam entegre tema sistemi:
  - Araç çubuğunda tek tıkla geçiş.
  - Sistem tercihi algılama.
  - `localStorage` kalıcılığı.
  - Yumuşak renk geçişleri.
  - Tailwind CSS v4 sınıf tabanlı karanlık mod.

### 💾 Veri Yönetimi
- **JSON İçe/Dışa Aktarma**: 
  - Çalışmanızı yerel olarak JSON formatında kaydedin.
  - Mevcut düzenleri içe aktarın.
  - **Akıllı İçe Aktarma**: Otomatik dönüştürme ile birden fazla JSON şemasını destekler.
- **Klavye Kısayolları**:
  - `Ctrl + Z`: Geri Al
  - `Ctrl + Y` / `Ctrl + Shift + Z`: Yinele
  - `Ctrl + D`: Seçili elementi çoğalt
  - `Delete` / `Backspace`: Seçili elementi kaldır

## 🛠️ Teknoloji Yığını

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **UI Kütüphanesi**: [React 19](https://react.dev/)
- **Stillendirme**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Sürükle & Bırak**: [react-dnd](https://react-dnd.github.io/react-dnd/)
- **İkonlar**: [react-icons](https://react-icons.github.io/react-icons/)
- **Dil**: [TypeScript](https://www.typescriptlang.org/)

## 📦 Kurulum

1.  **Depoyu klonlayın:**
    ```bash
    git clone https://github.com/kullaniciadiniz/test-builder-next.git
    cd test-builder-next
    ```

2.  **Bağımlılıkları yükleyin:**
    ```bash
    npm install
    # veya
    pnpm install
    # veya
    yarn install
    ```

3.  **Geliştirme sunucusunu çalıştırın:**
    ```bash
    npm run dev
    # veya
    pnpm run dev
    ```

4.  **Tarayıcınızı açın:**
    Oluşturmaya başlamak için [http://localhost:3000](http://localhost:3000) adresine gidin!

## 🎮 Kullanım Kılavuzu

1.  **Element Ekleme**: Sol taraftaki **Kenar Çubuğu**'ndan bir elementi (örneğin, "Kart") sürükleyin ve **Tuval** üzerine bırakın.
2.  **Düzenleme**: Seçmek için herhangi bir elemente tıklayın. Yüzen **Araç Çubuğu**nu kullanın veya **Ayarlar Modalı**nı açmak için "Düzenle"ye tıklayın.
3.  **Taşıma & Yeniden Boyutlandırma**: Elementleri tuval üzerinde sürükleyin. Hassas boyutlandırma için özellik panelini kullanın.
4.  **Responsive Kontrolü**: Düzeninizin nasıl uyarlandığını doğrulamak ve görünümler arasında geçiş yapmak için **Araç Çubuğu**'ndaki (üstte) cihaz ikonlarını kullanın.
5.  **Karanlık Mod**: Temaları değiştirmek için araç çubuğundaki Güneş/Ay ikonuna tıklayın.
6.  **Kaydetme**: Düzeninizi bir JSON dosyası olarak indirmek için araç çubuğundaki "Dışa Aktar" butonuna tıklayın.

## 📂 Proje Yapısı

```
test-builder-next/
├── app/
│   ├── components/         # UI Bileşenleri
│   │   ├── elements/       # Oluşturucu Elementleri (Kart, Kaydırıcı, vb.)
│   │   ├── Canvas.tsx      # Ana çizim alanı
│   │   ├── Canvas.tsx      # Ana çizim alanı
│   │   ├── ElementSettingsModal.tsx # Ayarlar penceresi
│   │   ├── Sidebar.tsx     # Araçlar için sol kenar çubuğu
│   │   └── Toolbar.tsx     # İşlemler için üst çubuk
│   ├── context/            # React Context'leri (Builder, Theme)
│   ├── utils/              # Yardımcılar (Doğrulama, Görsel işleme)
│   ├── globals.css         # Global stiller & Tailwind yapılandırması
│   ├── layout.tsx          # Kök düzen
│   └── page.tsx            # Ana uygulama sayfası
├── public/                 # Statik varlıklar
└── ...yapılandırma dosyaları
```


