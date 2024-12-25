document.addEventListener('DOMContentLoaded', () => {
    const maxSlotsPerDay = 5;
    const maxDaysPerPerson = 4;
    const form = document.getElementById('signupForm');
    const nameInput = document.getElementById('name');
    const selectedDayInput = document.getElementById('selectedDay');
    const calendarDiv = document.getElementById('calendar');
    const messageDiv = document.getElementById('message');
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

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

            dayDiv.addEventListener('click', () => selectDay(dayDiv));

            calendarDiv.appendChild(dayDiv);
        }
    }

    function selectDay(dayDiv) {
        const previousSelected = document.querySelector('.day.selected');
        if (previousSelected) {
            previousSelected.classList.remove('selected');
        }
        dayDiv.classList.add('selected');
        selectedDayInput.value = dayDiv.dataset.day;
    }

    function handleSubmit(event) {
        event.preventDefault();
        const name = nameInput.value.trim();
        const selectedDay = selectedDayInput.value;
        if (!name || !selectedDay) {
            messageDiv.textContent = 'Por favor, ingresa tu nombre y selecciona un día.';
            return;
        }

        const daysSignedUp = Object.values(signups).flat().filter(n => n === name).length;
        if (daysSignedUp >= maxDaysPerPerson) {
            messageDiv.textContent = `Solo puedes anotarte en ${maxDaysPerPerson} días por mes.`;
            return;
        }

        signups[selectedDay] = signups[selectedDay] || [];

        if (signups[selectedDay].includes(name)) {
            messageDiv.textContent = 'No puedes anotarte más de una vez en el mismo día.';
            return;
        }

        if (signups[selectedDay].length >= maxSlotsPerDay) {
            messageDiv.textContent = 'Este día ya está completo.';
            return;
        }

        signups[selectedDay].push(name);
        localStorage.setItem('signups', JSON.stringify(signups)); // Save signups to localStorage
        nameInput.value = '';
        selectedDayInput.value = '';
        renderCalendar(currentMonth, currentYear);
        messageDiv.textContent = 'Te has anotado con éxito.';
        messageDiv.style.color = 'green';
    }

    form.addEventListener('submit', handleSubmit);
    renderCalendar(currentMonth, currentYear);
});
