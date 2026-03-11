import streamlit as st
import requests

API = "http://127.0.0.1:8000"

st.set_page_config(page_title="AI Learning Assistant", layout="wide")
st.title("AI Learning Assistant")

# -----------------------------
# Session state init
# -----------------------------
if "quiz_data" not in st.session_state:
    st.session_state.quiz_data = None

if "quiz_submitted" not in st.session_state:
    st.session_state.quiz_submitted = False

if "quiz_score" not in st.session_state:
    st.session_state.quiz_score = 0

if "quiz_answers_checked" not in st.session_state:
    st.session_state.quiz_answers_checked = False


def reset_quiz_state():
    """Reset quiz-related session state."""
    st.session_state.quiz_data = None
    st.session_state.quiz_submitted = False
    st.session_state.quiz_score = 0
    st.session_state.quiz_answers_checked = False

    # remove previous selected radio answers
    keys_to_delete = [k for k in st.session_state.keys() if k.startswith("quiz_q_")]
    for k in keys_to_delete:
        del st.session_state[k]


tab1, tab2, tab3 = st.tabs(["AI Tutor", "AI Chatbot", "Quiz Generator"])

# =========================================================
# TAB 1 - AI Tutor
# =========================================================
with tab1:
    st.subheader("Upload Course Document")
    uploaded = st.file_uploader("Upload PDF/DOCX/TXT", type=["pdf", "docx", "txt"], key="u1")

    if uploaded and st.button("Upload & Index"):
        files = {"file": (uploaded.name, uploaded.getvalue())}
        r = requests.post(f"{API}/upload", files=files)
        data = r.json()

        if r.status_code == 200:
            st.success("Document uploaded and indexed successfully.")
            st.json(data)
        else:
            st.error(f"Upload failed: {data}")

    st.subheader("Ask from Uploaded Content")
    tutor_q = st.text_input("Tutor question", key="tutorq")

    if st.button("Ask Tutor"):
        r = requests.post(
            f"{API}/tutor/chat",
            json={"question": tutor_q, "session_id": "ajay"}
        )
        data = r.json()

        if r.status_code == 200:
            st.write("### Answer")
            st.write(data.get("answer", "No answer returned."))

            st.write("### Sources")
            sources = data.get("sources", [])
            if not sources:
                st.info("No sources returned.")
            else:
                for s in sources:
                    with st.expander(f"{s.get('doc_name', 'Document')} - page {s.get('page', '?')}"):
                        st.write(s.get("chunk_text", ""))
        else:
            st.error(f"Tutor request failed: {data}")


# =========================================================
# TAB 2 - General AI Chatbot
# =========================================================
with tab2:
    st.subheader("General AI Chatbot")
    chat_q = st.text_input("Ask anything", key="chatq")

    if st.button("Ask Chatbot"):
        r = requests.post(
            f"{API}/chatbot/chat",
            json={"question": chat_q, "session_id": "ajay"}
        )
        data = r.json()

        if r.status_code == 200:
            st.write("### Answer")
            st.write(data.get("answer", "No answer returned."))
        else:
            st.error(f"Chatbot request failed: {data}")


# =========================================================
# TAB 3 - Quiz Generator
# =========================================================
with tab3:
    st.subheader("Quiz Generator")

    topic = st.text_input("Topic", key="quiztopic")
    source_mode = st.selectbox("Source Mode", ["general", "document"])
    num_questions = st.number_input("Number of Questions", min_value=1, max_value=10, value=5)
    difficulty = st.selectbox("Difficulty", ["easy", "medium", "hard"])
    quiz_type = st.selectbox("Quiz Type", ["mcq", "short_answer", "true_false"])

    col1, col2 = st.columns([1, 1])

    with col1:
        if st.button("Generate Quiz"):
            payload = {
                "topic": topic,
                "source_mode": source_mode,
                "num_questions": int(num_questions),
                "difficulty": difficulty,
                "quiz_type": quiz_type,
                "session_id": "ajay"
            }

            r = requests.post(f"{API}/quiz/generate", json=payload)
            data = r.json()

            if r.status_code == 200:
                # supports both { ... } and {"quiz": {...}}
                quiz_data = data.get("quiz", data)

                reset_quiz_state()
                st.session_state.quiz_data = quiz_data

                st.success("Quiz generated successfully.")
            else:
                st.error(f"Quiz generation failed: {data}")

    with col2:
        if st.button("Reset Quiz"):
            reset_quiz_state()
            st.success("Quiz reset complete.")

    # -----------------------------
    # Render quiz if available
    # -----------------------------
    if st.session_state.quiz_data:
        quiz_data = st.session_state.quiz_data

        st.write("## Generated Quiz")
        st.write(f"**Topic:** {quiz_data.get('topic', topic)}")
        st.write(f"**Difficulty:** {quiz_data.get('difficulty', difficulty)}")
        st.write(f"**Quiz Type:** {quiz_data.get('quiz_type', quiz_type)}")

        questions = quiz_data.get("questions", [])

        if not questions:
            st.warning("No questions found in quiz response.")
        else:
            st.markdown("---")

            # show questions with radio buttons
            for i, q in enumerate(questions, start=1):
                st.markdown(f"### Q{i}. {q.get('question', 'No question text')}")

                options = q.get("options", [])
                radio_key = f"quiz_q_{i}"

                if options:
                    st.radio(
                        "Select your answer:",
                        options,
                        key=radio_key,
                        index=None
                    )
                else:
                    st.info("No options available for this question.")

                # After submission, show correct/wrong result
                if st.session_state.quiz_answers_checked:
                    selected = st.session_state.get(radio_key)
                    correct = q.get("answer", "")

                    if selected is None:
                        st.error("No answer selected. 0 point.")
                        st.info(f"Correct Answer: {correct}")
                    elif selected == correct:
                        st.success("Correct! +1 point")
                    else:
                        st.error("Wrong! 0 point")
                        st.info(f"Correct Answer: {correct}")

                st.markdown("---")

            # Submit button
            if not st.session_state.quiz_answers_checked:
                if st.button("Submit Quiz"):
                    score = 0

                    for i, q in enumerate(questions, start=1):
                        selected = st.session_state.get(f"quiz_q_{i}")
                        correct = q.get("answer", "")

                        if selected == correct:
                            score += 1

                    st.session_state.quiz_score = score
                    st.session_state.quiz_answers_checked = True
                    st.rerun()

            # Final score
            if st.session_state.quiz_answers_checked:
                total = len(questions)
                score = st.session_state.quiz_score

                st.write("## Final Score")
                st.write(f"**Your Score: {score} / {total}**")

                if score == total:
                    st.success("Excellent! You got all answers correct.")
                elif score >= total / 2:
                    st.info("Good job! Keep improving.")
                else:
                    st.warning("Keep practicing. Review the correct answers and try again.")