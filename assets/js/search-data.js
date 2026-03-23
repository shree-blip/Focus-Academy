// get the ninja-keys element
const ninja = document.querySelector('ninja-keys');

// add the home and posts menu items
ninja.data = [{
    id: "nav-about",
    title: "about",
    section: "Navigation",
    handler: () => {
      window.location.href = "/";
    },
  },{id: "nav-mentors",
          title: "mentors",
          description: "Focus Academy US Certified Mentors",
          section: "Navigation",
          handler: () => {
            window.location.href = "/people/";
          },
        },{id: "nav-operations",
          title: "operations",
          description: "course, enrollment, and payment operations blueprint",
          section: "Navigation",
          handler: () => {
            window.location.href = "/operations/";
          },
        },{id: "news-admissions-are-open-for-the-complete-individual-amp-amp-business-tax-preparation-program-22-core-classes-4-bonus-modules",
          title: 'Admissions are open for the Complete Individual &amp;amp;amp; Business Tax Preparation Program (22...',
          description: "",
          section: "News",},{id: "news-the-full-learning-path-is-now-published-beginner-classes-1-5-intermediate-6-12-advanced-13-19-and-expert-20-22-followed-by-bonus-modules-and-final-written-practical-exams",
          title: 'The full learning path is now published: beginner (Classes 1-5), intermediate (6-12), advanced...',
          description: "",
          section: "News",},{id: "news-pre-recorded-classes-are-secured-with-domain-lock-and-dynamic-watermarking-live-workshops-and-assessment-support-are-delivered-through-the-teaching-portal",
          title: 'Pre-recorded classes are secured with domain lock and dynamic watermarking. Live workshops and...',
          description: "",
          section: "News",},{id: "teachings-complete-individual-amp-business-tax-preparation-program",
          title: 'Complete Individual &amp;amp; Business Tax Preparation Program',
          description: "A structured US Tax Training Academy curriculum with 22 core classes and 4 bonus modules, designed to train beginner-to-expert tax preparers on Form 1040 and basic business returns.",
          section: "Teachings",handler: () => {
              window.location.href = "/teachings/data-science-fundamentals/";
            },},{id: "teachings-bonus-modules-and-certification-framework",
          title: 'Bonus Modules and Certification Framework',
          description: "Four bonus modules and the final assessment pathway supporting the Complete Individual &amp; Business Tax Preparation Program.",
          section: "Teachings",handler: () => {
              window.location.href = "/teachings/introduction-to-machine-learning/";
            },},{
        id: 'social-cv',
        title: 'CV',
        section: 'Socials',
        handler: () => {
          window.open("/assets/pdf/example_pdf.pdf", "_blank");
        },
      },{
        id: 'social-email',
        title: 'email',
        section: 'Socials',
        handler: () => {
          window.open("mailto:%79%6F%75@%65%78%61%6D%70%6C%65.%63%6F%6D", "_blank");
        },
      },{
        id: 'social-inspire',
        title: 'Inspire HEP',
        section: 'Socials',
        handler: () => {
          window.open("https://inspirehep.net/authors/1010907", "_blank");
        },
      },{
        id: 'social-rss',
        title: 'RSS Feed',
        section: 'Socials',
        handler: () => {
          window.open("/feed.xml", "_blank");
        },
      },{
        id: 'social-scholar',
        title: 'Google Scholar',
        section: 'Socials',
        handler: () => {
          window.open("https://scholar.google.com/citations?user=qc6CJjYAAAAJ", "_blank");
        },
      },{
        id: 'social-custom_social',
        title: 'Custom_social',
        section: 'Socials',
        handler: () => {
          window.open("https://www.alberteinstein.com/", "_blank");
        },
      },{
      id: 'light-theme',
      title: 'Change theme to light',
      description: 'Change the theme of the site to Light',
      section: 'Theme',
      handler: () => {
        setThemeSetting("light");
      },
    },
    {
      id: 'dark-theme',
      title: 'Change theme to dark',
      description: 'Change the theme of the site to Dark',
      section: 'Theme',
      handler: () => {
        setThemeSetting("dark");
      },
    },
    {
      id: 'system-theme',
      title: 'Use system default theme',
      description: 'Change the theme of the site to System Default',
      section: 'Theme',
      handler: () => {
        setThemeSetting("system");
      },
    },];
