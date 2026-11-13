"""
Creates realistic sample PDFs for immediate testing and demonstration.
"""
import os
import pymupdf

SAMPLES_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "sample_docs")
os.makedirs(SAMPLES_DIR, exist_ok=True)

def create_ai_handbook():
    path = os.path.join(SAMPLES_DIR, "AI_and_Machine_Learning_Handbook.pdf")
    doc = pymupdf.open()

    # Page 1: AI Fundamentals
    p1 = doc.new_page()
    rect1 = pymupdf.Rect(50, 50, 550, 750)
    text1 = (
        "AI AND MACHINE LEARNING HANDBOOK\n"
        "Chapter 1: Foundations of Artificial Intelligence\n\n"
        "Artificial Intelligence (AI) refers to the simulation of human intelligence in machines that are programmed "
        "to think, learn, and problem-solve. Modern AI applications range from autonomous vehicles to real-time language translation.\n\n"
        "Machine Learning is a specialized subset of artificial intelligence. It focuses on the development of mathematical models "
        "and algorithms that enable computer systems to autonomously learn patterns from historical data without explicit instruction.\n\n"
        "Supervised learning is the most widely adopted machine learning paradigm. In supervised learning, the model is trained on "
        "a labeled dataset where each input example is paired with an expected target output. Notable supervised learning algorithms include "
        "logistic regression, random forests, support vector machines (SVM), and gradient boosted decision trees.\n\n"
        "Unsupervised learning deals with unlabeled datasets where the model seeks to identify intrinsic clusters, groupings, and "
        "anomalies. Common techniques include K-Means clustering, Principal Component Analysis (PCA), and autoencoders."
    )
    p1.insert_textbox(rect1, text1, fontsize=11, fontname="helv")

    # Page 2: Deep Learning & Transformers
    p2 = doc.new_page()
    rect2 = pymupdf.Rect(50, 50, 550, 750)
    text2 = (
        "Chapter 2: Deep Learning and Attention Architectures\n\n"
        "Deep learning is a subfield of machine learning based on artificial neural networks with multiple representation layers. "
        "By passing information through successive non-linear activation functions, deep networks learn hierarchical abstractions.\n\n"
        "In 2017, the breakthrough paper 'Attention Is All You Need' introduced the Transformer architecture. Unlike recurrent neural "
        "networks (RNNs) and LSTMs that process tokens sequentially, transformers process entire sequences in parallel using "
        "multi-head self-attention mechanisms. This self-attention calculates dynamic attention weights between all token pairs.\n\n"
        "Large Language Models (LLMs) such as GPT-4, Claude, and Gemini are scaled autoregressive transformers trained on billions "
        "of web tokens. They demonstrate zero-shot learning, complex deductive reasoning, and code synthesis capabilities.\n\n"
        "Information retrieval in modern AI often combines dense vector embeddings with sparse lexical search like TF-IDF "
        "(Term Frequency-Inverse Document Frequency) to achieve high recall and precision in retrieval-augmented generation (RAG)."
    )
    p2.insert_textbox(rect2, text2, fontsize=11, fontname="helv")

    # Page 3: Evaluation Metrics & Ethics
    p3 = doc.new_page()
    rect3 = pymupdf.Rect(50, 50, 550, 750)
    text3 = (
        "Chapter 3: Evaluation Metrics and Responsible AI\n\n"
        "To objectively evaluate classification models, practitioners rely on confusion matrices, precision, recall, and the F1-Score. "
        "Precision measures the proportion of true positive predictions among all positive calls made by the model. "
        "Recall, also known as sensitivity, measures the proportion of actual positives that were correctly identified.\n\n"
        "The F1-Score is the harmonic mean of precision and recall: F1 = 2 * (Precision * Recall) / (Precision + Recall). "
        "When dealing with imbalanced datasets, accuracy can be misleading, making F1-score and Area Under the ROC Curve (AUC) essential.\n\n"
        "Responsible AI encompasses fairness, explainability, privacy preservation, and safety. Bias mitigation requires audited training sets, "
        "rigorous stress-testing across demographic sub-groups, and adherence to emerging global AI governance standards."
    )
    p3.insert_textbox(rect3, text3, fontsize=11, fontname="helv")

    doc.save(path)
    doc.close()
    print("Created:", path)

def create_company_policy():
    path = os.path.join(SAMPLES_DIR, "Thasmai_Company_Policy_2026.pdf")
    doc = pymupdf.open()

    # Page 1: Working Hours & Remote Work
    p1 = doc.new_page()
    rect1 = pymupdf.Rect(50, 50, 550, 750)
    text1 = (
        "THASMAI INFOTECH - EMPLOYEE HANDBOOK & OPERATIONAL POLICIES 2026\n"
        "Section 1: Working Hours, Attendance, and Hybrid Workplace Model\n\n"
        "Standard working hours at Thasmai Infotech are 9:30 AM to 6:30 PM Indian Standard Time (IST), Monday through Friday. "
        "Employees are entitled to a 60-minute lunch recess and two 15-minute relaxation breaks during the business day.\n\n"
        "The company operates under a modern hybrid work policy. Full-time team members are expected to work from the designated office "
        "hub at least three days per week, with the flexibility to work remotely for up to two days per week upon manager approval.\n\n"
        "Core collaboration hours are between 11:00 AM and 4:30 PM IST. All cross-functional syncs and client standups should be scheduled "
        "within these core hours to respect individual focus time."
    )
    p1.insert_textbox(rect1, text1, fontsize=11, fontname="helv")

    # Page 2: Leave & Compensation
    p2 = doc.new_page()
    rect2 = pymupdf.Rect(50, 50, 550, 750)
    text2 = (
        "Section 2: Annual Leave Entitlements, Sick Leave, and Parental Benefits\n\n"
        "Every permanent employee receives 24 days of paid time off (PTO) per calendar year, accrued on a pro-rata monthly basis of 2.0 days. "
        "Employees can carry forward up to 10 days of unused leave into the following fiscal year.\n\n"
        "Medical and sick leave allows for 12 paid days annually to attend to unexpected health concerns or hospitalizations. Medical certificates "
        "are required for sick absences exceeding two consecutive working days.\n\n"
        "Primary caregivers are entitled to 26 weeks of fully paid maternity leave. Secondary caregivers receive 4 weeks of paid paternity leave. "
        "Comprehensive health insurance covers employee, spouse, and up to two children with a sum insured of INR 5,00,000."
    )
    p2.insert_textbox(rect2, text2, fontsize=11, fontname="helv")

    # Page 3: Intellectual Property & Security
    p3 = doc.new_page()
    rect3 = pymupdf.Rect(50, 50, 550, 750)
    text3 = (
        "Section 3: Data Security, Confidentiality, and Intellectual Property\n\n"
        "All code, design systems, algorithms, models, and technical documentation produced during employment are the sole intellectual "
        "property of Thasmai Infotech. Employees must sign non-disclosure agreements (NDA) prior to beginning client engagements.\n\n"
        "Company laptops must enforce full-disk encryption with BitLocker or FileVault. Multi-factor authentication (MFA) is strictly mandatory "
        "for accessing internal source code repositories, databases, cloud staging environments, and corporate email systems.\n\n"
        "Annual performance reviews take place in the fourth quarter. Salary increments, promotions, and performance bonuses are determined "
        "by quarterly OKR achievements and technical capability assessments."
    )
    p3.insert_textbox(rect3, text3, fontsize=11, fontname="helv")

    doc.save(path)
    doc.close()
    print("Created:", path)

if __name__ == "__main__":
    create_ai_handbook()
    create_company_policy()

