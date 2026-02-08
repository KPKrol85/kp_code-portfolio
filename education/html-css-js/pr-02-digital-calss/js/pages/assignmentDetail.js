import { createEl } from "../utils/dom.js";
import { formatDate } from "../utils/format.js";
import { selectAssignmentById, selectSubmissionsForAssignment } from "../domain/assignments/selectors.js";
import { submitAssignment, gradeSubmission } from "../core/actions.js";
import { showToast } from "../ui/toast.js";

export const renderAssignmentDetail = (state, user, params, store) => {
  const assignment = selectAssignmentById(state, params.assignmentId);
  const wrapper = createEl("div");
  if (!assignment) {
    wrapper.appendChild(createEl("p", { text: "Brak zadania" }));
    return wrapper;
  }
  wrapper.appendChild(createEl("h1", { text: assignment.title }));
  wrapper.appendChild(createEl("p", { text: assignment.description }));
  wrapper.appendChild(createEl("p", { text: `Termin: ${formatDate(assignment.dueDate)}` }));

  if (user.role === "student") {
    const form = createEl("form", { className: "card" });
    form.innerHTML = `
      <h3>Oddaj zadanie</h3>
      <textarea class="input" name="content" rows="4" placeholder="Twoja odpowiedź"></textarea>
      <button class="button" type="submit">Wyślij</button>
    `;
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const content = form.content.value;
      if (!content) return;
      store.dispatch(submitAssignment({ assignmentId: assignment.id, studentId: user.id, content }));
      showToast("Oddano zadanie");
      form.reset();
    });
    wrapper.appendChild(form);
  }

  const submissions = selectSubmissionsForAssignment(state, assignment.id);
  const list = createEl("div", { className: "card" });
  list.appendChild(createEl("h3", { text: "Oddania" }));
  submissions.forEach((sub) => {
    const student = state.users.find((u) => u.id === sub.studentId);
    const item = createEl("div");
    item.innerHTML = `<strong>${student?.name}</strong><p>${sub.content}</p><span class="assignment-status">${sub.status}</span>`;
    if (user.role === "teacher" && sub.status !== "graded") {
      const gradeForm = createEl("form");
      gradeForm.innerHTML = `
        <input class="input" name="grade" placeholder="Ocena" />
        <input class="input" name="feedback" placeholder="Feedback" />
        <button class="button" type="submit">Oceń</button>
      `;
      gradeForm.addEventListener("submit", (event) => {
        event.preventDefault();
        store.dispatch(
          gradeSubmission({
            submissionId: sub.id,
            grade: gradeForm.grade.value,
            feedback: gradeForm.feedback.value,
            teacherId: user.id,
          })
        );
        showToast("Wystawiono ocenę");
      });
      item.appendChild(gradeForm);
    }
    list.appendChild(item);
  });
  wrapper.appendChild(list);
  return wrapper;
};
