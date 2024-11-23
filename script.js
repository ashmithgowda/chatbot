document.addEventListener("DOMContentLoaded", () => {
  const chatBox = document.getElementById("chat-box");
  const userInput = document.getElementById("user-input");
  const sendBtn = document.getElementById("send-btn");
  const registrationForm = document.getElementById("registration-form");

  // Buyers stored in localStorage
  const buyers = JSON.parse(localStorage.getItem("buyers")) || {};

  const saveBuyers = () => {
    localStorage.setItem("buyers", JSON.stringify(buyers));
  };

  const addMessage = (text, sender) => {
    const message = document.createElement("div");
    message.className = `message ${sender}`;
    message.innerHTML = text;
    chatBox.appendChild(message);
    chatBox.scrollTop = chatBox.scrollHeight;
  };

  const generateInvoice = (buyer) => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.text(`Invoice for ${buyer.name}`, 10, 10);
    doc.text(`Amount Due: ₹${buyer.due}`, 10, 20);
    doc.text(`Due Date: ${buyer.dueDate}`, 10, 30);
    doc.text("Thank you for doing business with us!", 10, 50);

    doc.save(`${buyer.name}-invoice.pdf`);
  };

  const UPI_ID = "9611596961@ybl"; // Your UPI ID

  const handleResponse = (input) => {
    const buyer = buyers[input.trim()];
    if (buyer) {
      addMessage(
        `Hi ${buyer.name}! You have ₹${buyer.due} due by ${buyer.dueDate}.
        <br>
        <a href="upi://pay?pa=${UPI_ID}&pn=${buyer.name}&am=${buyer.due}&cu=INR&tn=Textile+Payment" target="_blank">
          Pay Now
        </a>
        <br>
        <button onclick="generateInvoice(${JSON.stringify(buyer)})">Download Invoice</button>`,
        "bot"
      );
    } else {
      addMessage("I couldn't find your details. Please register first.", "bot");
    }
  };

  registrationForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("buyer-name").value.trim();
    const email = document.getElementById("buyer-email").value.trim();
    const due = document.getElementById("buyer-due").value.trim();
    const dueDate = document.getElementById("buyer-due-date").value.trim();

    buyers[name] = { name, email, due, dueDate };
    saveBuyers();

    alert(`${name} has been registered!`);
    registrationForm.reset();
  });

  sendBtn.addEventListener("click", () => {
    const input = userInput.value.trim();
    if (input) {
      addMessage(input, "user");
      setTimeout(() => handleResponse(input), 500);
      userInput.value = "";
    }
  });
});
