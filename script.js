document.addEventListener('DOMContentLoaded', () => {
    const maxSlotsPerDay = 5;
    const maxDaysPerPerson = 4;
    const form = document.getElementById('signupForm');
    const nameInput = document.getElementById('name');
    const calendarDiv = document.getElementById('calendar');
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

            calendarDiv.appendChild(dayDiv);
        }
    }

    function handleSubmit(event) {
        event.preventDefault();
        const name = nameInput.value.trim();
        if (!name) return;

        const daysSignedUp = Object.values(signups).flat().filter(n => n === name).length;
        if (daysSignedUp >= maxDaysPerPerson) {
            alert(`Solo puedes anotarte en ${maxDaysPerPerson} días por mes.`);
            return;
        }

        const dayDiv = document.querySelector('.day:hover');
        if (!dayDiv) {
            alert('Por favor, selecciona un día válido.');
            return;
        }

        const day = dayDiv.dataset.day;
        signups[day] = signups[day] || [];

        if (signups[day].includes(name)) {
            alert('No puedes anotarte más de una vez en el mismo día.');
            return;
        }

        if (signups[day].length >= maxSlotsPerDay) {
            alert('Este día ya está completo.');
            return;
        }

        signups[day].push(name);
        localStorage.setItem('signups', JSON.stringify(signups)); // Save signups to localStorage
        nameInput.value = '';
        renderCalendar(currentMonth, currentYear);
    }

    form.addEventListener('submit', handleSubmit);
    renderCalendar(currentMonth, currentYear);
});
