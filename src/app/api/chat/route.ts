import { NextRequest, NextResponse } from 'next/server';

// Function to check if message is personal/about Vivek
function isPersonalQuestion(message: string): boolean {
  const personalKeywords = [
    'vivek', 'you', 'your', 'yourself', 'about you', 'your skills', 'your projects',
    'your experience', 'your background', 'your resume', 'your contact',
    'your education', 'your work', 'your portfolio', 'your github', 'your linkedin',
    'your email', 'your location', 'where are you from', 'what do you do',
    'what are you studying', 'what is your major', 'what is your degree',
    'what languages do you speak', 'what are your interests', 'what are your hobbies',
    'what are you working on', 'what projects have you built', 'what technologies do you know',
    'what is your experience', 'how long have you been coding', 'what is your goal',
    'what do you want to do', 'what are your plans', 'what is your dream job',
    'what companies do you want to work for', 'what internships are you looking for',
    'what is your availability', 'when can you start', 'what is your schedule',
    'what is your timezone', 'what is your availability for meetings',
    'what is your preferred contact method', 'how can i reach you',
    'what is your phone number', 'what is your address', 'what is your website',
    'tell me about', 'tell me about yourself', 'tell your background', 'who are you',
    'what about you', 'about yourself', 'your background', 'your story',
    'what do you do', 'what are you', 'what is your story', 'what is your background',
    'tell me more about you', 'tell me about your background', 'what is your experience',
    'what have you done', 'what have you worked on', 'what have you built',
    'what projects do you have', 'what skills do you have', 'what can you do',
    'what are you good at', 'what are you studying', 'what is your major',
    'what is your degree', 'what university', 'what college', 'what school',
    'where do you study', 'where are you studying', 'what year are you',
    'what semester', 'what grade', 'what level', 'what program',
    'what field', 'what area', 'what domain', 'what specialization',
    'what focus', 'what concentration', 'what track', 'what stream',
    'what branch', 'what department', 'what faculty', 'what school',
    'what institute', 'what academy', 'what university', 'what college',
    'what institution', 'what organization', 'what company', 'what firm',
    'what startup', 'what business', 'what venture', 'what enterprise',
    'what corporation', 'what organization', 'what association', 'what society',
    'what club', 'what group', 'what team', 'what crew', 'what squad',
    'what gang', 'what posse', 'what circle', 'what network', 'what community'
  ];
  
  const lowerMessage = message.toLowerCase();
  return personalKeywords.some(keyword => lowerMessage.includes(keyword.toLowerCase()));
}

// Function to call OpenAI API
async function callOpenAI(message: string): Promise<string> {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful AI assistant. Provide clear, concise, and accurate responses to technical and general questions. Keep responses under 200 words unless more detail is specifically requested.'
          },
          {
            role: 'user',
            content: message
          }
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || 'Sorry, I could not generate a response.';
  } catch (error) {
    console.error('OpenAI API error:', error);
    return 'Sorry, I am having trouble connecting to my AI service right now. Please try again later.';
  }
}

export async function POST(request: NextRequest) {
  try {
    const { message, context } = await request.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // Convert message to lowercase for easier matching
    const lowerMessage = message.toLowerCase();

    // Handle different contexts
    let response = '';
    let source = 'ai';
    let image = null;

    console.log('API received:', { message, context, lowerMessage });

    // Check if this is a personal question about Vivek
    if (isPersonalQuestion(message)) {
      console.log('Personal question detected, using local responses');
      source = 'custom'; // Set source to 'custom' for personal questions

      // UNIVERSAL SKILLS CARD: If the message is about skills, always show the skills card
      if (/(skill|skills|technology|technologies|tech|programming)/i.test(lowerMessage)) {
        response = `
          <div class="rounded-xl bg-white/80 shadow p-4 flex flex-col gap-2">
            <div class="font-semibold text-lg flex items-center gap-2">
              💻 Technical Skills
            </div>
            <div class="text-gray-700">
              <p><strong>Programming Languages:</strong> Python, C++, Embedded C, Java, JavaScript, TypeScript</p>
              <p><strong>Web Development:</strong> Next.js, React JS, Responsive UI Design, HTML, CSS, Tailwind CSS</p>
              <p><strong>Databases:</strong> Firebase, SQL, NoSQL, MongoDB, PostgreSQL</p>
              <p><strong>AI & Machine Learning:</strong> OpenCV, Random Forest, TensorFlow, Scikit-learn</p>
              <p><strong>Tools & Version Control:</strong> Git, SDOM, ASCET, ECUTEST, Docker, AWS</p>
              <p><strong>Embedded Systems:</strong> Microcontrollers, Real-time Systems, Hardware Programming</p>
              <p><strong>Other:</strong> REST APIs, WebSockets, Microservices, CI/CD</p>
            </div>
          </div>
        `;
        return NextResponse.json({ message: response, source, image });
      }

      switch (context) {
        case 'contact':
          if (lowerMessage.includes('email') || lowerMessage.includes('mail') || lowerMessage.includes('contact')) {
            response = `
              <div class="rounded-xl bg-white/80 shadow p-4 flex flex-col gap-2">
                <div class="font-semibold text-lg flex items-center gap-2">
                  📧 Contact Information
                </div>
                <div class="text-gray-700">
                  <p><strong>Email:</strong> <a href="mailto:vivekc.mec@gmail.com" class="text-blue-600 hover:underline">vivekc.mec@gmail.com</a></p>
                  <p><strong>GitHub:</strong> <a href="https://github.com/Vivekc815" target="_blank" class="text-blue-600 hover:underline">github.com/Vivekc815</a></p>
                  <p><strong>Phone:</strong> <a href="tel:+918157004667" class="text-blue-600 hover:underline">+91 8157004667</a></p>
                  <p><strong>Location:</strong> Kerala, India</p>
                </div>
              </div>
            `;
          } else {
            response = "I can help you with contact information! Try asking about my email, GitHub, phone number, or location.";
          }
          break;

        case 'skills':
          // Only respond with skills card if the message explicitly mentions skills or related terms
          if (/(skill|skills|technology|technologies|tech|programming)/i.test(lowerMessage)) {
            response = `
              <div class="rounded-xl bg-white/80 shadow p-4 flex flex-col gap-2">
                <div class="font-semibold text-lg flex items-center gap-2">
                  💻 Technical Skills
                </div>
                <div class="text-gray-700">
                  <p><strong>Programming Languages:</strong> Python, C++, Embedded C, Java, JavaScript, TypeScript</p>
                  <p><strong>Web Development:</strong> Next.js, React JS, Responsive UI Design, HTML, CSS, Tailwind CSS</p>
                  <p><strong>Databases:</strong> Firebase, SQL, NoSQL, MongoDB, PostgreSQL</p>
                  <p><strong>AI & Machine Learning:</strong> OpenCV, Random Forest, TensorFlow, Scikit-learn</p>
                  <p><strong>Tools & Version Control:</strong> Git, SDOM, ASCET, ECUTEST, Docker, AWS</p>
                  <p><strong>Embedded Systems:</strong> Microcontrollers, Real-time Systems, Hardware Programming</p>
                  <p><strong>Other:</strong> REST APIs, WebSockets, Microservices, CI/CD</p>
                </div>
              </div>
            `;
          } else {
            response = "I can tell you about my technical skills! Ask me about programming languages, frameworks, tools, or specific technologies I work with.";
          }
          break;

        case 'resume':
          if (lowerMessage.includes('resume') || lowerMessage.includes('cv') || lowerMessage.includes('experience') || lowerMessage.includes('work')) {
            response = `
              <div class="rounded-xl bg-white/80 shadow p-4 flex flex-col gap-2">
                <div class="font-semibold text-lg flex items-center gap-2">
                  📄 Resume & Experience
                </div>
                <div class="flex gap-4">
                  <img src="/vivek.jpg" alt="Vivek's Photo" class="w-24 h-24 rounded-full object-cover border-2 border-green-400 shadow-md" />
                  <div class="text-gray-700 flex-1">
                    <p><strong>Education:</strong> B.Tech in Electronics and Communication Engineering from Model Engineering College and MS in CS student at University of Florida, Expected 2027</p>
                    <p><strong>Current Role:</strong> MS in CS Student at University of Florida</p>
                    <p><strong>Previous Experience:</strong> Software Engineer at Bosch (3 years)</p>
                    <p><strong>Additional Experience:</strong> Years of hands-on work in personal projects and competitive coding</p>
                    <div class="mt-3 space-y-2">
                      <p><strong>View Resume:</strong></p>
                      <div class="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <iframe 
                          src="/Vivek_Resume.pdf#toolbar=0&navpanes=0&scrollbar=0" 
                          class="w-full h-96 rounded border border-gray-300"
                          title="Vivek's Resume"
                        ></iframe>
                      </div>
                      <p class="text-sm text-gray-600">
                        <a href="/Vivek_Resume.pdf" target="_blank" class="text-blue-600 hover:underline flex items-center gap-1">
                          📥 Download Resume (PDF)
                        </a>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            `;
          } else {
            response = "I can help you with my resume and experience! Ask me about my education, work experience, or view my resume.";
          }
          break;

        case 'projects':
          if (lowerMessage.includes('project') || lowerMessage.includes('work') || lowerMessage.includes('portfolio') || lowerMessage.includes('app')) {
            response = `
              <div class="rounded-xl bg-white/80 shadow p-4 flex flex-col gap-2">
                <div class="font-semibold text-lg flex items-center gap-2">
                  🚀 Projects
                </div>
                <div class="text-gray-700 space-y-3">
                  <div>
                    <p><strong>1. Talk2DB - AI-powered Natural Language to SQL Converter</strong></p>
                    <p class="text-sm text-gray-600 ml-4">Built with Next.js 15, TypeScript, and OpenAI GPT-3.5-turbo API</p>
                    <p class="text-sm text-gray-600 ml-4">Features modern UI with Framer Motion animations and responsive design</p>
                    <p class="text-sm text-gray-600 ml-4">Implements RESTful API endpoints with comprehensive error handling</p>
                    <p class="text-sm text-gray-600 ml-4">Enables users to convert natural language queries to SQL statements instantly</p>
                    <p class="text-sm text-blue-600 ml-4"><a href="https://talk2-db-vivek-s-projects-944930d9.vercel.app/" target="_blank" class="hover:underline">🌐 Live Demo</a></p>
                  </div>
                  
                  <div>
                    <p><strong>2. Tweet Sentimental Analyzer Beta</strong></p>
                    <p class="text-sm text-gray-600 ml-4">Tweet Sentiment Analyzer | Next.js, TypeScript, Python, FastAPI, scikit-learn</p>
                    <p class="text-sm text-gray-600 ml-4">Built full-stack ML web app with custom sentiment analysis model</p>
                    <p class="text-sm text-gray-600 ml-4">Deployed on Railway (backend) and Vercel (frontend) with cross-platform compatibility</p>
                    <p class="text-sm text-gray-600 ml-4">Implemented real-time API integration between React frontend and Python ML backend</p>
                    <p class="text-sm text-blue-600 ml-4"><a href="https://twitter-sentimental-beta.vercel.app/" target="_blank" class="hover:underline">🌐 Live Demo</a></p>
                  </div>
                  
                  <div>
                    <p><strong>3. AI Portfolio</strong></p>
                    <p class="text-sm text-gray-600 ml-4">This portfolio website with AI chatbot integration</p>
                  </div>
                  
                  <div>
                    <p><strong>4. E-Compare</strong></p>
                    <p class="text-sm text-gray-600 ml-4">Developed an application using React.js for the frontend and Node.js powered by Express for the backend</p>
                    <p class="text-sm text-gray-600 ml-4">Assists customers to make better buys across e-commerce websites</p>
                    <p class="text-sm text-gray-600 ml-4">Allows users to search for a product, compare prices across various e-commerce websites</p>
                    <p class="text-sm text-gray-600 ml-4">Returns the best possible cost for the product with consolidated price list</p>
                  </div>
                  
                  <div>
                    <p><strong>5. Blackboard</strong></p>
                    <p class="text-sm text-gray-600 ml-4">Contributed to develop an application based on Flutter for educational purposes</p>
                    <p class="text-sm text-gray-600 ml-4">Acts as an interface application between faculty, admin, and students</p>
                    <p class="text-sm text-gray-600 ml-4">Built using Flutter for frontend and Firebase for backend development</p>
                    <p class="text-sm text-gray-600 ml-4">Uses Firebase authentication, Cloud Firestore, and Firebase Cloud Messaging for real-time features</p>
                  </div>
                </div>
              </div>
            `;
          } else {
            response = "I can tell you about my projects! Ask me about specific projects, technologies used, or my portfolio work.";
          }
          break;

        case 'me':
          // If the message is about skills, show the skills card
          if (/(skill|skills|technology|technologies|tech|programming)/i.test(lowerMessage)) {
            response = `
              <div class="rounded-xl bg-white/80 shadow p-4 flex flex-col gap-2">
                <div class="font-semibold text-lg flex items-center gap-2">
                  💻 Technical Skills
                </div>
                <div class="text-gray-700">
                  <p><strong>Programming Languages:</strong> Python, C++, Embedded C, Java, JavaScript, TypeScript</p>
                  <p><strong>Web Development:</strong> Next.js, React JS, Responsive UI Design, HTML, CSS, Tailwind CSS</p>
                  <p><strong>Databases:</strong> Firebase, SQL, NoSQL, MongoDB, PostgreSQL</p>
                  <p><strong>AI & Machine Learning:</strong> OpenCV, Random Forest, TensorFlow, Scikit-learn</p>
                  <p><strong>Tools & Version Control:</strong> Git, SDOM, ASCET, ECUTEST, Docker, AWS</p>
                  <p><strong>Embedded Systems:</strong> Microcontrollers, Real-time Systems, Hardware Programming</p>
                  <p><strong>Other:</strong> REST APIs, WebSockets, Microservices, CI/CD</p>
                </div>
              </div>
            `;
          } else if ((/about yourself|who are you|tell me about yourself|about me|yourself|who are you|who am i|who is vivek/i.test(lowerMessage))) {
            response = `
              <div class="rounded-xl bg-white/80 shadow p-4 flex flex-col gap-2">
                <div class="font-semibold text-lg flex items-center gap-2">
                  👨‍💻 About Me
                </div>
                <div class="flex gap-4">
                  <img src="/vivek.jpg" alt="Vivek's Photo" class="w-32 h-32 rounded-full object-cover border-2 border-green-400 shadow-md" />
                  <div class="text-gray-700 flex-1">
                    <p>Hi! I'm Vivek, a passionate Computer Science student and developer from Kerala, India.</p>
                    <p><strong>Education:</strong> B.Tech in Electronics and Communication Engineering and MS in CS student at University of Florida, Expected 2027</p>
                    <p><strong>Interests:</strong> Web Development, AI/ML, Open Source, Problem Solving</p>
                    <p><strong>Currently:</strong> Building innovative projects and learning new technologies</p>
                    <p><strong>Experience:</strong> Software Engineer with 3 years of experience at Bosch, complemented by years of consistent hands-on work in personal projects and competitive coding.</p>
                    <p><strong>Goal:</strong> To create impactful software solutions and contribute to the tech community</p>
                    <p><strong>Languages:</strong> English, Malayalam, Hindi</p>
                    <p><strong>Fun Fact:</strong> My code runs better than my sleep schedule! 😄</p>
                  </div>
                </div>
              </div>
            `;
          } else {
            response = "I can tell you about myself! Ask me about my background, interests, or what I'm currently working on.";
          }
          break;

        default:
          // General personal responses
          if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
            response = "Hello! I'm Vivek's AI assistant. How can I help you today? You can ask me about my skills, projects, experience, or contact information.";
          } else if (lowerMessage.includes('help') || lowerMessage.includes('what can you do')) {
            response = "I can help you learn about Vivek! Here are some things you can ask me about:\n\n• Skills and technologies\n• Projects and portfolio\n• Work experience and resume\n• Contact information\n• Personal background\n\nJust ask me anything!";
          } else if (lowerMessage.includes('internship') || lowerMessage.includes('job') || lowerMessage.includes('opportunity')) {
            response = `
              <div class="rounded-xl bg-white/80 shadow p-4 flex flex-col gap-2">
                <div class="font-semibold text-lg flex items-center gap-2">
                  🟢 Open to Internships
                </div>
                <div class="text-gray-700">
                  Yes! I'm actively looking for internship opportunities for <strong>Summer 2026</strong>.<br/>
                  I'm interested in roles in web development, software engineering, and AI/ML.<br/>
                  Feel free to reach out if you have an opportunity or want to collaborate!
                </div>
              </div>
            `;
          } else if (lowerMessage.includes('background') && !lowerMessage.includes('education') && !lowerMessage.includes('study')) {
            response = `
              <div class="rounded-xl bg-white/80 shadow p-4 flex flex-col gap-2">
                <div class="font-semibold text-lg flex items-center gap-2">
                  🎓 Educational Background
                </div>
                <div class="flex gap-4">
                  <img src="/vivek.jpg" alt="Vivek's Photo" class="w-24 h-24 rounded-full object-cover border-2 border-green-400 shadow-md" />
                  <div class="text-gray-700 flex-1">
                    <p><strong>Undergraduate:</strong> I completed my UG from Government Model Engineering College in Electronics and Communication Engineering</p>
                    <p><strong>Current:</strong> MS in Computer Science student at University of Florida, Expected 2027</p>
                    <p><strong>Experience:</strong> Software Engineer with 3 years of experience at Bosch</p>
                    <p><strong>Focus:</strong> Web Development, AI/ML, Embedded Systems, and Software Engineering</p>
                  </div>
                </div>
              </div>
            `;
          } else if (lowerMessage.includes('about') || lowerMessage.includes('yourself') || lowerMessage.includes('who') || lowerMessage.includes('tell me')) {
            response = `
              <div class="rounded-xl bg-white/80 shadow p-4 flex flex-col gap-2">
                <div class="font-semibold text-lg flex items-center gap-2">
                  👨‍💻 About Me
                </div>
                <div class="flex gap-4">
                  <img src="/vivek.jpg" alt="Vivek's Photo" class="w-32 h-32 rounded-full object-cover border-2 border-green-400 shadow-md" />
                  <div class="text-gray-700 flex-1">
                    <p>Hi! I'm Vivek, a passionate Computer Science student and developer from Kerala, India.</p>
                    <p><strong>Education:</strong> B.Tech in Electronics and Communication Engineering and MS in CS student at University of Florida, Expected 2027</p>
                    <p><strong>Interests:</strong> Web Development, AI/ML, Open Source, Problem Solving</p>
                    <p><strong>Currently:</strong> Building innovative projects and learning new technologies</p>
                    <p><strong>Experience:</strong> Software Engineer with 3 years of experience at Bosch, complemented by years of consistent hands-on work in personal projects and competitive coding.</p>
                    <p><strong>Goal:</strong> To create impactful software solutions and contribute to the tech community</p>
                    <p><strong>Languages:</strong> English, Malayalam, Hindi</p>
                    <p><strong>Fun Fact:</strong> My code runs better than my sleep schedule! 😄</p>
                  </div>
                </div>
              </div>
            `;
          } else if (lowerMessage.includes('education') || lowerMessage.includes('study') || lowerMessage.includes('university') || lowerMessage.includes('college') || lowerMessage.includes('degree') || lowerMessage.includes('ug') || lowerMessage.includes('undergraduate')) {
            response = `
              <div class="rounded-xl bg-white/80 shadow p-4 flex flex-col gap-2">
                <div class="font-semibold text-lg flex items-center gap-2">
                  🎓 Education
                </div>
                <div class="flex gap-4">
                  <img src="/vivek.jpg" alt="Vivek's Photo" class="w-24 h-24 rounded-full object-cover border-2 border-green-400 shadow-md" />
                  <div class="text-gray-700 flex-1">
                    <p><strong>Current:</strong> MS in Computer Science at University of Florida</p>
                    <p><strong>Expected Graduation:</strong> 2027</p>
                    <p><strong>Undergraduate:</strong> B.Tech in Electronics and Communication Engineering from Government Model Engineering College</p>
                    <p><strong>Focus Areas:</strong> Web Development, AI/ML, Software Engineering, Embedded Systems</p>
                    <p><strong>Current Status:</strong> Graduate student building innovative projects</p>
                  </div>
                </div>
              </div>
            `;
          } else if (lowerMessage.includes('experience') || lowerMessage.includes('work') || lowerMessage.includes('job') || lowerMessage.includes('career')) {
            response = `
              <div class="rounded-xl bg-white/80 shadow p-4 flex flex-col gap-2">
                <div class="font-semibold text-lg flex items-center gap-2">
                  💼 Experience
                </div>
                <div class="flex gap-4">
                  <img src="/vivek.jpg" alt="Vivek's Photo" class="w-24 h-24 rounded-full object-cover border-2 border-green-400 shadow-md" />
                  <div class="text-gray-700 flex-1">
                    <p><strong>Current Role:</strong> MS in CS Student at University of Florida</p>
                    <p><strong>Previous Experience:</strong> Software Engineer at Bosch (3 years)</p>
                    <p><strong>Additional Experience:</strong> Years of hands-on work in personal projects and competitive coding</p>
                    <p><strong>Specialties:</strong> Web Development, React, Node.js, Python, AI/ML</p>
                    <p><strong>Looking For:</strong> Internship opportunities for Summer 2026</p>
                  </div>
                </div>
              </div>
            `;
          } else {
            response = "I'm here to help you learn about Vivek! You can ask me about his skills, projects, experience, contact information, or anything else. What would you like to know?";
          }
          break;
      }
    } else {
      // This is a general/technical question, use OpenAI
      console.log('General/technical question detected, using OpenAI');
      source = 'openai';
      response = await callOpenAI(message);
    }

    console.log('API response:', { response, source, image });
    
    return NextResponse.json({
      message: response,
      source: source,
      image: image
    });

  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 