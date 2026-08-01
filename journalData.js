// The Enchanted Journal of Pratiksha — Local Folder Image Configuration

window.journalData = {
  title: "The Enchanted Journal of Pratiksha",
  subtitle: "A Magical Tale Written in the Stars",
  recipient: "Pratiksha",
  
  spreads: [
    // Spread 1: Prologue / Intro
    {
      spreadNumber: 1,
      leftPage: {
        type: "prologue-left",
        badge: "Prologue",
        title: "The Enchanted Journal",
        subtitle: "of Pratiksha",
        crest: "✨ 🏰 ✨",
        text: "Dedicated to a wonderful friend whose journey shines bright. Welcome to an enchanted chronicle of memories, laughter, silent care, and magical surprises.A magical tale of friendship, laughter, and cherished memories."
      },
      rightPage: {
        type: "toc-right",
        badge: "Contents",
        title: "Table of Contents",
        intro: "A magical tale of friendship, laughter, and cherished memories.",
        items: [
          { chapter: "Prologue", description: "The Enchanted Journal" },
          { chapter: "Chapter I", description: "6th Standard Days" },
          { chapter: "Chapter II", description: "Entrance Exam Reunion" },
          { chapter: "Chapter III", description: "Instagram Reconnection" },
          { chapter: "Chapter IV", description: "Forever Friendship" },
          { chapter: "Chapter V", description: "Writer's Realm" },
          { chapter: "Chapter VI", description: "Poetry & Quotes" },
          { chapter: "Chapter VII", description: "Photo Gallery" },
          { chapter: "Chapter VIII", description: "Birthday Letter" },
          { chapter: "Chapter IX", description: "The Epilogue" }
        ]
      }
    },

    // Spread 2: 6th Standard Memories
    {
      spreadNumber: 2,
      leftPage: {
        type: "image-left",
        badge: "Chapter I",
        title: "6th Standard Days",
        tagline: "The Unspoken Beginning",
        imageUrl: "images/school_classroom.jpg",
        imageCaption: "School Campus & Classrooms"
      },
      rightPage: {
        type: "text-right",
        badge: "Memories",
        title: "Classroom Bond",
        imageUrl: "images/class_group_photo.jpg",
        imageCaption: "Class Group & Friends",
        content: `Back in 6th standard, amidst busy classrooms and bustling hallways, our paths first crossed. We weren't part of the same inner circle back then, nor did we talk every day. Yet, looking back at our class group photos, there was always a quiet, comforting bond waiting for its time to shine.`
      }
    },

    // Spread 3: Entrance Exam Reunion
    {
      spreadNumber: 3,
      leftPage: {
        type: "image-left",
        badge: "Chapter II",
        title: "Entrance Exam Reunion",
        tagline: "An Unexpected Alignment",
        imageUrl: "images/exam_hall.jpg",
        imageCaption: "The Exam Hall Encounter"
      },
      rightPage: {
        type: "text-right",
        badge: "Unexpected Talk",
        title: "Exam Whispers",
        content: `It was a tense entrance exam morning filled with quiet nervousness. By a delightful twist of fate, our roll numbers landed right next to each other.

While everyone else scribbled nervously, we ended up whispering, sharing secret smiles, and turning a stressful exam into an unforgettable memory.`
      }
    },

    // Spread 4: Instagram Reconnection & Friendship
    {
      spreadNumber: 4,
      leftPage: {
        type: "image-left",
        badge: "Chapter III",
        title: "Instagram Reconnection",
        tagline: "Midnight Chats",
        imageUrl: "images/starlight_chats.jpg",
        imageCaption: "Starlight Conversations",
        content: `A simple Instagram story reply brought us back into each other's lives. What started as casual messages turned into endless late-night chats long after midnight.`
      },
      rightPage: {
        type: "text-right",
        badge: "Chapter IV",
        title: "Forever Friendship",
        tagline: "Unspoken Care & Silent Support",
        content: `True friendship isn't measured by daily messages—it's built on constant, unspoken care. Even when life gets busy and talks grow quiet, the warmth and mutual support remain unshakable.`
      }
    },

    // Spread 5: Writer's Realm & Poetry
    {
      spreadNumber: 5,
      leftPage: {
        type: "text-left",
        badge: "Chapter V",
        title: "Writer's Realm",
        tagline: "The Art of Storytelling",
        content: `Words have the power to weave magic, heal souls, and create worlds. In our conversations, we found a shared love for storytelling, literature, and deep thoughts that go far beyond the surface.

"Every story we share becomes a glowing thread in the tapestry of our friendship."`
      },
      rightPage: {
        type: "poetry-right",
        badge: "Chapter VI",
        title: "Poetry & Ankur Thakur Quotes",
        tagline: "Verses for a Special Soul",
        quotes: [
          {
            text: "Log kehte hain ki waqt ke sath zakhm bhar jaate hain, par sach toh yeh hai ki acche dost waqt ko hi haseen bana dete hain.",
            author: "Ankur Thakur"
          },
          {
            text: "Kuch rishte baaton se nahi, bas khamoshi mein chhupi sacchi parwah se gehre hote hain.",
            author: "Ankur Thakur"
          }
        ]
      }
    },

    // Spread 6: Photo Gallery
    {
      spreadNumber: 6,
      leftPage: {
        type: "gallery-left",
        badge: "Chapter VII",
        title: "Photo Gallery",
        tagline: "Illuminated Portraits I",
        portraits: [
          {
            imageUrl: "images/pratiksha1.jpg"
          },
          {
            imageUrl: "images/pratiksha2.jpg"
          },
          {
            imageUrl: "images/pratiksha3.jpg"
          },
          {
            imageUrl: "images/pratiksha4.jpg"
          }
        ]
      },
      rightPage: {
        type: "envelope-right",
        badge: "Royal Scroll",
        title: "Birthday Letter",
        tagline: "Tap the Red Wax Seal to Reveal the Message",
        waxSealImageUrl: "images/red_wax_seal.jpg",
        waxSealCaption: "Red Wax Seal of Friendship",
        salutation: "Dearest Pratiksha,",
        header: "Happy Birthday! ✨🎂🪄",
        body: `On this magical day, as another year adds its golden shimmer to your journey, I want to celebrate YOU—the resilient, brilliant, and wonderful person that you are!

From 6th standard memories to our unexpected exam hall seating, to midnight chats and our silent bond—every chapter with you is a blessing. May your coming year be filled with boundless joy, radiant health, peace, and every dream your heart holds!`
      }
    },

    // Spread 7: Epilogue
    {
      spreadNumber: 7,
      leftPage: {
        type: "wishes-left",
        badge: "Chapter VIII",
        title: "The Epilogue",
        tagline: "Best Wishes",
        wishes: [
          "✨ May your life be as magical as an enchanted spell.",
          "🌟 May all your biggest dreams take flight to golden heights.",
          "💖 May our bond of friendship stay strong forever."
        ]
      },
      rightPage: {
        type: "ending-right",
        badge: "The End",
        title: "Eternal Friendship",
        closing: "With all best wishes for a magnificent life ahead! ✨"
      }
    }
  ]
};