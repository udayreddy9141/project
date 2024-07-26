// script.js
const token = localStorage.getItem('authToken');

document.getElementById('resultForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const studentName = document.getElementById('studentName').value;
    const rollNumber = document.getElementById('rollNumber').value;
    const subject = document.getElementById('subject').value;
    const marks = document.getElementById('marks').value;

    const resultMessage = document.getElementById('resultMessage');
    const resultsTable = document.getElementById('resultsTable').getElementsByTagName('tbody')[0];

    if (studentName && rollNumber && subject && marks) {
        fetch('http://localhost:3000/api/results', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ studentName, rollNumber, subject, marks })
        })
        .then(response => response.json())
        .then(data => {
            if (data.message === 'Result added successfully') {
                const newRow = resultsTable.insertRow();

                const nameCell = newRow.insertCell(0);
                const rollCell = newRow.insertCell(1);
                const subjectCell = newRow.insertCell(2);
                const marksCell = newRow.insertCell(3);

                nameCell.textContent = studentName;
                rollCell.textContent = rollNumber;
                subjectCell.textContent = subject;
                marksCell.textContent = marks;

                resultMessage.textContent = 'Result submitted successfully!';
                resultMessage.style.color = 'green';

                // Clear form fields
                document.getElementById('resultForm').reset();
            } else {
                resultMessage.textContent = 'Error: ' + data.message;
                resultMessage.style.color = 'red';
            }
        })
        .catch(error => {
            resultMessage.textContent = 'Error: ' + error.message;
            resultMessage.style.color = 'red';
        });
    } else {
        resultMessage.textContent = 'Please fill out all fields.';
        resultMessage.style.color = 'red';
    }
});

// Load existing results from the backend
window.addEventListener('load', function() {
    fetch('http://localhost:3000/api/results', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(data => {
        const resultsTable = document.getElementById('resultsTable').getElementsByTagName('tbody')[0];
        data.forEach(result => {
            const newRow = resultsTable.insertRow();

            const nameCell = newRow.insertCell(0);
            const rollCell = newRow.insertCell(1);
            const subjectCell = newRow.insertCell(2);
            const marksCell = newRow.insertCell(3);

            nameCell.textContent = result.studentName;
            rollCell.textContent = result.rollNumber;
            subjectCell.textContent = result.subject;
            marksCell.textContent = result.marks;
        });
    })
    .catch(error => {
        console.error('Error fetching results:', error);
    });
});
