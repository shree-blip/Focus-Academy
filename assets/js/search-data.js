// get the ninja-keys element
const ninja = document.querySelector('ninja-keys');

// add the home and posts menu items
ninja.data = [{
    id: "nav-home",
    title: "Home",
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
        },{id: "post-",
        
          title: "",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2026/2026-03-23-standard-vs-itemized-deduction/";
          
        },
      },{id: "post-",
        
          title: "",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2026/2026-03-23-responding-to-common-irs-notices/";
          
        },
      },{id: "post-w-2-vs-1099-income-basics-for-new-tax-preparers",
        
          title: "W-2 vs 1099 Income Basics for New Tax Preparers",
        
        description: "Understand the core differences between employee and contractor income before preparing returns.",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2026/w2-vs-1099-basics/";
          
        },
      },{id: "post-form-1040-schedules-explained-for-beginners",
        
          title: "Form 1040 Schedules Explained for Beginners",
        
        description: "A beginner-friendly overview of where common income, tax, and credit items are reported.",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2026/form-1040-schedules-explained/";
          
        },
      },{id: "post-common-filing-status-mistakes-and-how-to-avoid-them",
        
          title: "Common Filing Status Mistakes and How to Avoid Them",
        
        description: "A practical guide to selecting the correct filing status and avoiding common return errors.",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2026/common-filing-status-mistakes/";
          
        },
      },{id: "news-admissions-are-now-open-for-the-complete-individual-amp-amp-business-tax-preparation-program-with-22-core-classes-and-3-bonus-modules",
          title: 'Admissions are now open for the Complete Individual &amp;amp;amp; Business Tax Preparation Program...',
          description: "",
          section: "News",},{id: "news-the-full-learning-path-is-published-with-module-sequencing-from-foundations-to-advanced-filing-practice-followed-by-a-90-minute-written-exam-and-a-3-hour-practical-assessment",
          title: 'The full learning path is published with module sequencing from foundations to advanced...',
          description: "",
          section: "News",},{id: "news-learner-content-is-protected-with-domain-lock-and-dynamic-watermarking-while-live-doubt-clearing-workshops-and-assessment-support-are-delivered-through-the-teaching-portal",
          title: 'Learner content is protected with domain lock and dynamic watermarking, while live doubt-clearing...',
          description: "",
          section: "News",},{id: "news-weekend-live-workshop-slots-are-available-for-revision-classes-on-form-1040-schedules-filing-status-decisions-and-dependent-related-case-practice",
          title: 'Weekend live workshop slots are available for revision classes on Form 1040 schedules,...',
          description: "",
          section: "News",},{id: "news-module-1-to-module-3-assignment-checklists-are-now-available-in-the-learner-portal-with-submission-deadlines-and-feedback-timelines",
          title: 'Module 1 to Module 3 assignment checklists are now available in the learner...',
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
        id: 'social-email',
        title: 'email',
        section: 'Socials',
        handler: () => {
          window.open("mailto:%69%6E%66%6F@%66%6F%63%75%73%79%6F%75%72%66%69%6E%61%6E%63%65.%63%6F%6D", "_blank");
        },
      },{
        id: 'social-rss',
        title: 'RSS Feed',
        section: 'Socials',
        handler: () => {
          window.open("/feed.xml", "_blank");
        },
      },{
        id: 'social-custom_social',
        title: 'Custom_social',
        section: 'Socials',
        handler: () => {
          window.open("https://wa.me/9779800000000", "_blank");
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
