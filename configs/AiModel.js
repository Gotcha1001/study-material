const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "application/json",
};

export const courseOutlineAIModel = model.startChat({
  generationConfig,
  history: [
    {
      role: "user",
      parts: [
        {
          text: "Generate study material for Music Healing Frequencies for Exam and the level of difficulty will be Easy with a summary of the course, the List of Chapters along with the summary for each chapter, Topic List in each chapter in JSON format",
        },
      ],
    },
    {
      role: "model",
      parts: [
        {
          text: '## Music Healing Frequencies: Easy Level Exam Study Material\n\n**Course Summary:** This course provides a basic understanding of how certain musical frequencies can be used to promote relaxation, improve mood, and potentially aid in healing.  It explores the fundamental principles without delving into complex scientific or technical details.  The focus is on understanding the general concepts and applications, not the intricate physics behind sound waves.\n\n**List of Chapters and Summaries:**\n\n**Chapter 1: Introduction to Sound and Vibration**\n\n* **Summary:** This chapter introduces the basic concepts of sound as vibration and its impact on the human body and mind.  It explains how different frequencies affect us differently, laying the groundwork for understanding the principles of music therapy.\n\n**Chapter 2:  Frequencies and Their Effects**\n\n* **Summary:**  This chapter explores different frequency ranges and their general associations with specific emotional or physical states.  It covers concepts like Alpha waves, Beta waves, Delta waves, and Theta waves and their potential benefits without delving into complicated neurology.\n\n**Chapter 3:  Types of Healing Music**\n\n* **Summary:**  This chapter introduces various types of music commonly used in sound healing, such as binaural beats, Solfeggio frequencies, and nature sounds.  It briefly explains the purported benefits of each type without rigorous scientific claims.\n\n**Chapter 4:  Practical Applications of Music Healing**\n\n* **Summary:** This chapter explores practical applications of music healing frequencies, including stress reduction, improved sleep, pain management, and enhanced meditation.  It focuses on the basic understanding of how these frequencies can be applied.\n\n\n**JSON Format Topic List:**\n\n```json\n{\n  "chapters": [\n    {\n      "chapter_title": "Introduction to Sound and Vibration",\n      "topics": [\n        "What is sound?",\n        "Sound as vibration",\n        "How sound travels",\n        "The human body\'s response to sound",\n        "Frequency and amplitude"\n      ]\n    },\n    {\n      "chapter_title": "Frequencies and Their Effects",\n      "topics": [\n        "Brainwave states (Alpha, Beta, Theta, Delta)",\n        "General effects of low frequencies",\n        "General effects of high frequencies",\n        "Resonance and the body",\n        "Understanding Hertz (Hz)"\n      ]\n    },\n    {\n      "chapter_title": "Types of Healing Music",\n      "topics": [\n        "Binaural beats: basic explanation",\n        "Solfeggio frequencies: basic explanation",\n        "Nature sounds and their effects",\n        "Ambient music for relaxation",\n        "Choosing appropriate music"\n      ]\n    },\n    {\n      "chapter_title": "Practical Applications of Music Healing",\n      "topics": [\n        "Stress reduction techniques using music",\n        "Improving sleep quality with music",\n        "Music for pain management (basic concepts)",\n        "Music and meditation",\n        "Limitations and ethical considerations"\n      ]\n    }\n  ]\n}\n```\n\n**Note:** This study material is for an easy-level exam.  It avoids complex scientific explanations and focuses on basic understanding.  For more in-depth knowledge, further research is recommended.  Always consult with a healthcare professional before using music therapy as a treatment for any medical condition.\n',
        },
      ],
    },
    {
      role: "user",
      parts: [
        {
          text: "Generate study material for Music Healing Frequencies for Exam and the level of difficulty will be Easy with a summary of the course, the List of Chapters along with the summary for each chapter, Topic List in each chapter, all results in JSON format",
        },
      ],
    },
    {
      role: "model",
      parts: [
        {
          text: '```json\n{\n  "courseSummary": "This course provides a basic understanding of how certain musical frequencies can be used to promote relaxation, improve mood, and potentially aid in healing. It explores the fundamental principles without delving into complex scientific or technical details. The focus is on understanding the general concepts and applications, not the intricate physics behind sound waves.",\n  "chapters": [\n    {\n      "chapterTitle": "Introduction to Sound and Vibration",\n      "chapterSummary": "This chapter introduces the basic concepts of sound as vibration and its impact on the human body and mind. It explains how different frequencies affect us differently, laying the groundwork for understanding the principles of music therapy.",\n      "topics": [\n        "What is sound?",\n        "Sound as vibration",\n        "How sound travels (basic explanation)",\n        "The human body\'s response to sound (general overview)",\n        "Frequency and amplitude (basic concepts)",\n        "The difference between frequency and pitch"\n      ]\n    },\n    {\n      "chapterTitle": "Frequencies and Their Effects",\n      "chapterSummary": "This chapter explores different frequency ranges and their general associations with specific emotional or physical states. It covers concepts like Alpha waves, Beta waves, Delta waves, and Theta waves and their potential benefits without delving into complicated neurology.",\n      "topics": [\n        "Brainwave states (Alpha, Beta, Theta, Delta – general characteristics)",\n        "General effects of low frequencies (e.g., relaxation)",\n        "General effects of high frequencies (e.g., alertness)",\n        "Resonance and the body (simplified explanation)",\n        "Understanding Hertz (Hz) – basic unit of frequency"\n      ]\n    },\n    {\n      "chapterTitle": "Types of Healing Music",\n      "chapterSummary": "This chapter introduces various types of music commonly used in sound healing, such as binaural beats, Solfeggio frequencies, and nature sounds. It briefly explains the purported benefits of each type without rigorous scientific claims.",\n      "topics": [\n        "Binaural beats: a simple definition and purported effects",\n        "Solfeggio frequencies: a simple definition and purported effects",\n        "Nature sounds and their calming effects",\n        "Ambient music for relaxation",\n        "The role of rhythm and melody in healing music"\n      ]\n    },\n    {\n      "chapterTitle": "Practical Applications of Music Healing",\n      "chapterSummary": "This chapter explores practical applications of music healing frequencies, including stress reduction, improved sleep, pain management, and enhanced meditation. It focuses on the basic understanding of how these frequencies can be applied.",\n      "topics": [\n        "Stress reduction techniques using music (general overview)",\n        "Improving sleep quality with music (general overview)",\n        "Music for pain management (basic concepts)",\n        "Music and meditation (basic concepts)",\n        "Using music for self-care"\n      ]\n    },\n    {\n      "chapterTitle": "Ethical Considerations and Limitations",\n      "chapterSummary": "This chapter briefly discusses the ethical considerations and limitations of using music healing frequencies, emphasizing the importance of responsible use and seeking professional advice when necessary.",\n      "topics": [\n        "Music therapy vs. medical treatment",\n        "The placebo effect",\n        "The importance of professional guidance",\n        "Avoiding misleading claims",\n        "Respecting cultural contexts"\n      ]\n    }\n  ]\n}\n```\n',
        },
      ],
    },
  ],
});

export const generateNotesAiModel = model.startChat({
  generationConfig: {
    temperature: 1,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain", // Change from "application/json" to "text/plain"
  },
  history: [
    {
      role: "user",
      parts: [
        {
          text: 'Generate exam material detail content for each chapter, Make sure to include all topic points in the content, make sure to give content in HTML format(Do not Add HTMLKL, Head, Body, title tag), The chapters :\n{\n      "chapterTitle": "Working with Files",\n      "emoji": "📁",\n      "chapterSummary": "This chapter covers file input/output operations, including reading from and writing to various file types.",\n      "topics": [\n        "Opening and closing files",\n        "Reading data from files (line by line, entire file)",\n        "Writing data to files",\n        "Working with different file modes (read, write, append)",\n        "Handling exceptions during file operations",\n        "File path manipulation"\n      ]\n    },\n',
        },
      ],
    },
    {
      role: "model",
      parts: [
        {
          text: "```html\n<h3>📁 Working with Files</h3>\n<p>This chapter covers file input/output operations, including reading from and writing to various file types.</p>\n\n<h4>Opening and closing files</h4>\n<p>This section will cover the basics of opening files using appropriate functions (e.g., <code>open()</code> in Python) and specifying file paths.  It will also detail the importance of closing files using <code>close()</code> to release system resources and prevent data loss.  Students should be able to demonstrate proper file opening and closing syntax and understand the potential consequences of neglecting to close files.</p>\n\n<h4>Reading data from files (line by line, entire file)</h4>\n<p>This section will explain how to read data from files both line by line (using iteration or <code>readline()</code>) and by reading the entire file content at once (e.g., using <code>read()</code>).  Students should be able to choose the appropriate method based on the task and data size.  Examples using different file types (text, CSV, etc.) will be provided.</p>\n\n<h4>Writing data to files</h4>\n<p>This section will cover writing data to files using functions like <code>write()</code> and <code>writelines()</code>.  Students should understand how to format output for readability and handle different data types (strings, numbers, etc.).  The concept of overwriting existing files versus appending to them will be explained.</p>\n\n<h4>Working with different file modes (read, write, append)</h4>\n<p>This section will detail the various file modes (e.g., 'r', 'w', 'a', 'r+', 'w+', 'a+') and their implications for file operations.  Students should be able to select the appropriate mode based on the intended file operation (reading, writing, appending).  The differences between these modes will be clearly illustrated with examples.</p>\n\n<h4>Handling exceptions during file operations</h4>\n<p>This section focuses on error handling using <code>try...except</code> blocks to gracefully manage potential errors like <code>FileNotFoundError</code>, <code>IOError</code>, and others that can occur during file operations.  Students will learn how to implement robust code that handles these exceptions without crashing the program.  Best practices for exception handling will be discussed.</p>\n\n<h4>File path manipulation</h4>\n<p>This section will cover manipulating file paths, including joining paths, getting file names and extensions, and creating directories.  Students should be able to use appropriate functions (e.g., <code>os.path.join()</code>, <code>os.path.splitext()</code>, <code>os.makedirs()</code> in Python) to manage file paths effectively. The use of relative vs. absolute paths will also be addressed.</p>\n```\n",
        },
      ],
    },
    {
      role: "user",
      parts: [
        {
          text: 'Generate exam material detail content for each chapter, Make sure to include all topic points in the content, make sure to give content in HTML format(Do not Add HTMLKL, Head, Body, title tag), add indigo for the titles ,The chapters :\n{\n"chapterTitle": "Working with Files",\n"emoji": "📁",\n"chapterSummary": "This chapter covers file input/output operations, including reading from and writing to various file types.",\n"topics": [\n"Opening and closing files",\n"Reading data from files (line by line, entire file)",\n"Writing data to files",\n"Working with different file modes (read, write, append)",\n"Handling exceptions during file operations",\n"File path manipulation"\n]\n},',
        },
      ],
    },
    {
      role: "model",
      parts: [
        {
          text: '```html\n<h3 style="color: indigo;">📁 Working with Files</h3>\n<p>This chapter covers file input/output operations, including reading from and writing to various file types.</p>\n\n<h4 style="color: indigo;">Opening and closing files</h4>\n<p>This section will cover the basics of opening files using appropriate functions (e.g., <code>open()</code> in Python) and specifying file paths.  It will also detail the importance of closing files using <code>close()</code> to release system resources and prevent data loss.  Students should be able to demonstrate proper file opening and closing syntax and understand the potential consequences of neglecting to close files.</p>\n\n<h4 style="color: indigo;">Reading data from files (line by line, entire file)</h4>\n<p>This section will explain how to read data from files both line by line (using iteration or <code>readline()</code>) and by reading the entire file content at once (e.g., using <code>read()</code>).  Students should be able to choose the appropriate method based on the task and data size.  Examples using different file types (text, CSV, etc.) will be provided.</p>\n\n<h4 style="color: indigo;">Writing data to files</h4>\n<p>This section will cover writing data to files using functions like <code>write()</code> and <code>writelines()</code>.  Students should understand how to format output for readability and handle different data types (strings, numbers, etc.).  The concept of overwriting existing files versus appending to them will be explained.</p>\n\n<h4 style="color: indigo;">Working with different file modes (read, write, append)</h4>\n<p>This section will detail the various file modes (e.g., \'r\', \'w\', \'a\', \'r+\', \'w+\', \'a+\') and their implications for file operations.  Students should be able to select the appropriate mode based on the intended file operation (reading, writing, appending).  The differences between these modes will be clearly illustrated with examples.</p>\n\n<h4 style="color: indigo;">Handling exceptions during file operations</h4>\n<p>This section focuses on error handling using <code>try...except</code> blocks to gracefully manage potential errors like <code>FileNotFoundError</code>, <code>IOError</code>, and others that can occur during file operations.  Students will learn how to implement robust code that handles these exceptions without crashing the program.  Best practices for exception handling will be discussed.</p>\n\n<h4 style="color: indigo;">File path manipulation</h4>\n<p>This section will cover manipulating file paths, including joining paths, getting file names and extensions, and creating directories.  Students should be able to use appropriate functions (e.g., <code>os.path.join()</code>, <code>os.path.splitext()</code>, <code>os.makedirs()</code> in Python) to manage file paths effectively. The use of relative vs. absolute paths will also be addressed.</p>\n```\n',
        },
      ],
    },
  ],
});

export const generateStudyTypeContentAiModel = model.startChat({
  generationConfig,
  history: [
    {
      role: "user",
      parts: [
        {
          text: "Generate the flashcard on topic: Flutter Fundamentals, User Interface (UI) Development, Basic App Navigation in JSON format with front back content maximum 15",
        },
      ],
    },
    {
      role: "model",
      parts: [
        {
          text: '```json\n[\n  {\n    "front": "What is a Widget in Flutter?",\n    "back": "The basic building block of a Flutter UI. Everything is a widget."\n  },\n  {\n    "front": "What are the two main types of Widgets?",\n    "back": "StatelessWidget and StatefulWidget."\n  },\n  {\n    "front": "Difference between StatelessWidget and StatefulWidget?",\n    "back": "StatelessWidget: immutable UI; StatefulWidget: mutable UI, rebuilds when state changes."\n  },\n  {\n    "front": "How to build a simple Text widget?",\n    "back": " `Text(\'Hello World!\')`"\n  },\n  {\n    "front": "How to create a column of widgets?",\n    "back": " `Column(children: [widget1, widget2, ...])`"\n  },\n  {\n    "front": "How to create a row of widgets?",\n    "back": " `Row(children: [widget1, widget2, ...])`"\n  },\n  {\n    "front": "What is a Scaffold widget?",\n    "back": "Provides a basic visual layout structure for an app (appBar, body, etc.)."\n  },\n  {\n    "front": "How to use `MaterialApp`?",\n    "back": "Wraps your app, providing material design theming and navigation."\n  },\n  {\n    "front": "What is the purpose of `Navigator`?",\n    "back": "Manages routes and transitions between screens (pages)."\n  },\n  {\n    "front": "How to navigate to a new route?",\n    "back": " `Navigator.push(context, MaterialPageRoute(builder: (context) => NewScreen()));`"\n  },\n  {\n    "front": "How to pop (go back) from a route?",\n    "back": " `Navigator.pop(context);` or `Navigator.pop(context, result);`"\n  },\n  {\n    "front": "What is a `BuildContext`?",\n    "back": "Provides information about the widget\'s location in the widget tree."\n  },\n  {\n    "front": "What is a Route?",\n    "back": "A single screen or page in the app\'s navigation."\n  },\n  {\n    "front": "What is the role of `Key` in widgets?",\n    "back": "Unique identifier for a widget; helps Flutter identify and manage widgets efficiently."\n  },\n  {\n    "front": "How to handle user input in a Flutter app?",\n    "back": "Using widgets like `TextField`, `Checkbox`, `Button`, and managing state changes."\n  }\n]\n```\n',
        },
      ],
    },
  ],
});

export const GenerateQuizAiModel = model.startChat({
  generationConfig,
  history: [
    {
      role: "user",
      parts: [
        {
          text: "Generate Quiz on topic: Flutter Fundamentals, User Interface (UI) Development, Basic App Navigation with Question and Options along with correct answers in JSON format",
        },
      ],
    },
    {
      role: "model",
      parts: [
        {
          text: '```json\n{\n  "quizTitle": "Flutter Fundamentals & UI Development Quiz",\n  "questions": [\n    {\n      "question": "What is the core building block of Flutter UI?",\n      "options": ["Widgets", "Layouts", "Components", "Fragments"],\n      "answer": "Widgets"\n    },\n    {\n      "question": "Which widget is used to arrange children in a column?",\n      "options": ["Row", "Column", "Stack", "Container"],\n      "answer": "Column"\n    },\n    {\n      "question": "What is the purpose of a StatefulWidget?",\n      "options": ["To create static UI elements", "To manage state changes in UI", "To define app\'s overall structure", "To handle user input"],\n      "answer": "To manage state changes in UI"\n    },\n    {\n      "question": "Which widget is best suited for displaying a list of items that can be scrolled?",\n      "options": ["ListView", "GridView", "Container", "Row"],\n      "answer": "ListView"\n    },\n    {\n      "question": "What is the primary method for navigating between screens in Flutter?",\n      "options": ["Using Fragments", "Employing Activities", "Utilizing the Navigator", "Switching Views"],\n      "answer": "Utilizing the Navigator"\n    },\n    {\n      "question": "Which widget is commonly used to display images in Flutter?",\n      "options": ["Image.asset", "Image.network", "Both Image.asset and Image.network", "Picture"],\n      "answer": "Both Image.asset and Image.network"\n    },\n    {\n      "question": "What does `BuildContext` represent in Flutter?",\n      "options": ["The current theme of the app", "The location of a widget in the widget tree", "The app\'s state", "The device\'s screen size"],\n      "answer": "The location of a widget in the widget tree"\n    },\n    {\n      "question": "How do you create a Stateless Widget?",\n      "options": ["`class MyWidget extends StatefulWidget`", "`class MyWidget extends StatelessWidget`", "`class MyWidget extends Widget`", "None of the above"],\n      "answer": "`class MyWidget extends StatelessWidget`"\n    },\n      {\n      "question": "Which widget is used to create a simple button in Flutter?",\n      "options": ["IconButton", "ElevatedButton", "TextButton", "All of the above"],\n      "answer": "All of the above"\n    },\n    {\n      "question": "What is the role of the `key` property in a Widget?",\n      "options": ["To identify a widget uniquely", "To define its position", "To manage its state", "To determine its size"],\n      "answer": "To identify a widget uniquely"\n    }\n  ]\n}\n```\n',
        },
      ],
    },
  ],
});

export const GenerateQuestionsAnswersAiModel = model.startChat({
  generationConfig,
  history: [
    {
      role: "user",
      parts: [
        {
          text: "Generate questions and answers for the topic: Flutter Fundamentals, User Interface (UI) Development, Basic App Navigation in JSON format with Questions and Answers , content maximum 15 Questions and Answers",
        },
      ],
    },
    {
      role: "model",
      parts: [
        {
          text: '```json\n{\n  "Flutter Fundamentals & UI Development": [\n    {\n      "question": "What is Flutter?",\n      "answer": "Flutter is Google\'s UI toolkit for building natively compiled applications for mobile, web, and desktop from a single codebase."\n    },\n    {\n      "question": "What is a Widget in Flutter?",\n      "answer": "A Widget is the fundamental building block of a Flutter UI. Everything you see on the screen is a widget, even the layout itself."\n    },\n    {\n      "question": "Explain the difference between StatelessWidget and StatefulWidget.",\n      "answer": "StatelessWidget:  A widget that doesn\'t change after it\'s built.  StatefulWidget: A widget that can change its state and rebuild itself based on that change."\n    },\n    {\n      "question": "What is the role of the `BuildContext`?",\n      "answer": "The `BuildContext` provides information about the widget\'s location in the widget tree, allowing widgets to access information about their parent and children."\n    },\n    {\n      "question": "How do you build a simple row layout in Flutter?",\n      "answer": "Use a `Row` widget to arrange widgets horizontally.  Example: `Row(children: [WidgetA(), WidgetB()])`"\n    },\n    {\n      "question": "How do you build a simple column layout in Flutter?",\n      "answer": "Use a `Column` widget to arrange widgets vertically. Example: `Column(children: [WidgetA(), WidgetB()])`"\n    },\n    {\n      "question": "What are some common layout widgets in Flutter?",\n      "answer": "Besides `Row` and `Column`, common layout widgets include `Container`, `Padding`, `Center`, `Expanded`, `Flex`, `Stack` and `GridView`."\n    },\n    {\n      "question": "How do you add padding around a widget?",\n      "answer": "Use the `Padding` widget.  Example: `Padding(padding: EdgeInsets.all(16.0), child: MyWidget())`"\n    },\n    {\n      "question": "What is the purpose of a `Container` widget?",\n      "answer": "A `Container` is a convenient widget that combines common properties like padding, margin, background color, and border into a single widget."\n    }\n  ],\n  "Basic App Navigation": [\n    {\n      "question": "What is the simplest way to navigate between screens in Flutter?",\n      "answer": "Using `Navigator.push` and `Navigator.pop`."\n    },\n    {\n      "question": "Explain the role of `MaterialPageRoute`.",\n      "answer": "It\'s a route that creates a Material Design transition animation when navigating between screens."\n    },\n    {\n      "question": "How do you pass data to a new screen during navigation?",\n      "answer": "Using arguments in `Navigator.push` with `MaterialPageRoute`\'s `settings` property or using constructor arguments within the navigated-to screen\'s widget."\n    },\n    {\n      "question": "How do you retrieve data from a screen after it\'s popped?",\n      "answer": "Using the result provided by `Navigator.push`\'s `Future`."\n    },\n    {\n      "question": "What is a `Named Route` and why is it useful?",\n      "answer": "Named routes allow you to navigate to screens by their name, making code cleaner and easier to maintain for larger applications."\n    }\n  ]\n}\n```\n',
        },
      ],
    },
  ],
});

// const result = await chatSession.sendMessage("INSERT_INPUT_HERE");
// console.log(result.response.text());
