document.addEventListener('DOMContentLoaded', () => {
    const maxSlotsPerDay = 5;
    const maxDaysPerPerson = 4;
    const form = document.getElementById('signupForm');
    const nameInput = document.getElementById('name');
    const calendarDiv = document.getElementById('calendar');
    const messageDiv = document.getElementById('message');
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    let selectedDays = []; // Array to keep track of selected days

    // Load signups from localStorage or initialize an empty object if not present
    const signups = JSON.parse(localStorage.getItem('signups')) || {};

    function renderCalendar(month, year) {
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        calendarDiv.innerHTML = '';

        for (let day = 1; day <= daysInMonth; day++) {
            const dayDiv = document.createElement('div');
            dayDiv.className = 'day';
            dayDiv.textContent = day;
            dayDiv.dataset.day = day;

            const slots = signups[day] || [];
            dayDiv.innerHTML += `<br><small>${slots.length}/${maxSlotsPerDay} inscritos</small>`;

            if (slots.length >= maxSlotsPerDay) {
                dayDiv.classList.add('full');
            }

            if (selectedDays.includes(day.toString())) {
                dayDiv.classList.add('selected');
            }

            dayDiv.addEventListener('click', (event) => selectDay(event, dayDiv));

            calendarDiv.appendChild(dayDiv);
        }
    }

    function selectDay(event, dayDiv) {
        // Prevent selection of full days
        if (dayDiv.classList.contains('full')) {
            messageDiv.textContent = 'Este día ya está completo.';
            return;
        }

        const day = dayDiv.dataset.day;

        if (selectedDays.includes(day)) {
            // Deselect the day
            selectedDays = selectedDays.filter(d => d !== day);
            dayDiv.classList.remove('selected');
        } else {
            // Check if the user has already selected 4 days
            if (selectedDays.length >= maxDaysPerPerson) {
                messageDiv.textContent = `Solo puedes seleccionar hasta ${maxDaysPerPerson} días.`;
                return;
            }
            // Select the day
            selectedDays.push(day);
            dayDiv.classList.add('selected');
        }
        messageDiv.textContent = ''; // Clear error message
    }

    function handleSubmit(event) {
        event.preventDefault();
        const name = nameInput.value.trim();
        if (!name || selectedDays.length === 0) {
            messageDiv.textContent = 'Por favor, ingresa tu nombre y selecciona al menos un día.';
            return;
        }

        const daysSignedUp = Object.values(signups).flat().filter(n => n === name).length;
        if (daysSignedUp + selectedDays.length > maxDaysPerPerson) {
            messageDiv.textContent = `Solo puedes anotarte en un total de ${maxDaysPerPerson} días por mes.`;
            return;
        }

        selectedDays.forEach(day => {
            signups[day] = signups[day] || [];
            if (!signups[day].includes(name) && signups[day].length < maxSlotsPerDay) {
                signups[day].push(name);
            }
        });

        localStorage.setItem('signups', JSON.stringify(signups)); // Save signups to localStorage
        nameInput.value = '';
        selectedDays = [];
        renderCalendar(currentMonth, currentYear);
        messageDiv.textContent = 'Te has anotado con éxito.';
        messageDiv.style.color = 'green';
    }

    form.addEventListener('submit', handleSubmit);
    renderCalendar(currentMonth, currentYear);
});
