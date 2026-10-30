# Learning Lab: all-course dashboard update

This release covers 24 revision question banks / 1,580 questions in Year 7 Maths,
Year 9 Science, Year 10 Chemistry and Year 10 Physics, plus **42 question-based
games / 183 rounds**.

Included recent additions:

- Y7 Maths: **Algebra II** (100 questions, including adding/multiplying variable terms) and **Statistics** (60).
- Y9 Science: **Blood vessels and blood**, **Static electricity and charge**, and **Electric circuits** (60 questions each).
- All earlier Y7 Maths, Y9 Science, Y10 Chemistry and Y10 Physics banks remain included.

The Pizza Circuit, Resistance Run and Circuit Construction Studio lead to the
**Electric circuits → Test yourself** quiz. Their animations, construction steps,
local practical questions and notebooks do not send records. The mercury barometer
uses the existing **Gas laws → Test yourself** quiz. No new apparatus-specific
spreadsheet tabs are needed.

The dashboard header now uses **Learning Lab by Asiel**, retaining **A PLACE FOR CURIOUS MINDS**. For game recording, replace all three Google files and deploy a new version,
even if revision question banks already show Ready. Passwords, results and
question-bank signatures stay unchanged.

1. In your existing private results spreadsheet, choose Extensions → Apps Script.
2. Replace all three files: Code.gs, QuestionBank.gs and Dashboard.html. If the
   main script is named Código.gs, replace it; do not add duplicate functions.
3. Save, then run setupLearningLab using the owner account. Existing results and
   the existing teacher password are preserved. Do not reset the password.
4. Deploy → Manage deployments → Edit → New version → Deploy. Keep the existing
   /exec URL, Execute as Me and access Anyone. The sheet itself stays Restricted.
5. Open https://asielhm.github.io/learning-lab/teacher/ and click Check deployed
   update. Reload a new-course quiz when its question bank shows Ready.
6. For games, check the separate game coverage on the teacher page. Students choose
   **Play for my teacher**, enter name, class and teacher, and start a new game.
   In the private dashboard choose **Completed games** or **Individual game rounds**
   in View. Setup adds **GameAnswers** and **GameSessions**, preserving other tabs.
7. Complete a Test yourself quiz with student name, class and teacher. Wait for
   confirmed saves, then sign in to check its score and answers on the dashboard.

Test yourself and games explicitly started with Play for my teacher are recorded.
Practice, retry rounds, apparatus notebooks,
gas-law object explorations and Year 12 guided calculator practice are excluded.
New-course quizzes check matching public bank signatures before asking for pupil
identity or sending answers. An old, mismatched or unreachable deployment leaves
those quizzes local. The original four connected quizzes keep their current
recording while this update is installed. No passwords or student data are in
these files.
