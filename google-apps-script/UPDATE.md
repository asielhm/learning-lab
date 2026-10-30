# Learning Lab: all-course dashboard update

This release covers 24 revision question banks / 1,580 questions in Year 7 Maths,
Year 9 Science, Year 10 Chemistry and Year 10 Physics.

1. In your existing private results spreadsheet, choose Extensions → Apps Script.
2. Replace all three files: Code.gs, QuestionBank.gs and Dashboard.html. If the
   main script is named Código.gs, replace it; do not add duplicate functions.
3. Save, then run setupLearningLab using the owner account. Existing results and
   the existing teacher password are preserved. Do not reset the password.
4. Deploy → Manage deployments → Edit → New version → Deploy. Keep the existing
   /exec URL, Execute as Me and access Anyone. The sheet itself stays Restricted.
5. Open https://asielhm.github.io/learning-lab/teacher/ and click Check deployed
   update. Reload a new-course quiz when its question bank shows Ready.
6. Complete a Test yourself quiz with student name, class and teacher. Wait for
   confirmed saves, then sign in to check its score and answers on the dashboard.

Only Test yourself is recorded. Practice, retry rounds, apparatus notebooks,
gas-law object explorations and Year 12 guided calculator practice are excluded.
New-course quizzes check matching public bank signatures before asking for pupil
identity or sending answers. An old, mismatched or unreachable deployment leaves
those quizzes local. The original four connected quizzes keep their current
recording while this update is installed. No passwords or student data are in
these files.
