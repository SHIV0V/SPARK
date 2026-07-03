document.addEventListener("DOMContentLoaded", () => {
    // Circular web positioning logic
    const webs = document.querySelectorAll(".web-image");
    const container = document.querySelector(".web-container");
    const webSection = document.querySelector(".web-section");
    const arrowLeft = document.querySelector(".arrow-left");
    const arrowRight = document.querySelector(".arrow-right");
    const titleElement = document.querySelector(".head-dark-blue");
    const descriptionElement = document.querySelector(".web-description");

    let angleIndex = 0;
    const radius = 200;
    const webCount = webs.length;

    const webData = [
        { title: "Explorer", description: "Discover and explore universities, courses, and career options. Whether you have a specific course or college in mind, use this feature to search and find detailed information tailored to your needs.", class: "head-dark-blue" },
        { title: "Smart Advisor", description: "Not sure which course to pursue? This feature asks a series of questions, analyzes your responses, and provides personalized recommendations to help you choose the best path for your future.", class: "head-dark-green" },
        { title: "Categories", description: " Access a comprehensive list of courses, colleges, competitive exams, and career options. Easily navigate through each category to find detailed information and resources tailored to your needs.", class: "head-dark-pink" },
        { title: "Transition Pathway", description: " Looking to shift careers? Answer some questions, and we’ll chart a personalized pathway for you, outlining the steps and resources needed to transition successfully into your new field.", class: "head-yellow" }
    ];

    function positionwebs() {
        webs.forEach((web, index) => {
            const angle = (2 * Math.PI * (index - angleIndex)) / webCount;
            const x = container.offsetWidth / 2 + radius * Math.cos(angle) - web.offsetWidth / 2;
            const y = container.offsetHeight / 2 + radius * Math.sin(angle) - web.offsetHeight / 2;

            web.style.transform = `translate(${x}px, ${y}px)`;

            const isAtNinePosition = (index + webCount - angleIndex) % webCount === 2;
            web.style.transform += isAtNinePosition ? " scale(1.5)" : " scale(1)";
            web.style.opacity = isAtNinePosition ? "1" : "0.6";

            if (isAtNinePosition) {
                const titleClass = webData[index].class;
                titleElement.textContent = webData[index].title;

                // Activate/deactivate yellow containers based on the active web
                const yellowContainers = document.querySelectorAll('.yellow-container1, .yellow-container2, .yellow-container3, .yellow-container4');
                yellowContainers.forEach(container => container.classList.remove('active'));

                if (webData[index].title === "Categories") {
                    document.querySelector('.yellow-container1').classList.add('active');
                } else if (webData[index].title === "Smart Advisor") {
                    document.querySelector('.yellow-container2').classList.add('active');
                } else if (webData[index].title === "Explorer") {
                    document.querySelector('.yellow-container3').classList.add('active');
                } else if (webData[index].title === "Transition Pathway") {
                    document.querySelector('.yellow-container4').classList.add('active');
                }

                titleElement.className = titleClass;
                descriptionElement.textContent = webData[index].description;
            }
        });
    }

    function handleMouseScroll(event) {
        if (event.target.closest(".web-container")) {
            angleIndex = (angleIndex + (event.deltaY > 0 ? 1 : -1) + webCount) % webCount;
            positionwebs();
            event.preventDefault();
        }
    }

    function rotateLeft() {
        angleIndex = (angleIndex - 1 + webCount) % webCount;
        positionwebs();
    }

    function rotateRight() {
        angleIndex = (angleIndex + 1) % webCount;
        positionwebs();
    }

    arrowLeft.addEventListener("click", rotateLeft);
    arrowRight.addEventListener("click", rotateRight);
    webSection.addEventListener("wheel", handleMouseScroll);

    positionwebs();

    // Fetch top searched professions
    fetch("/get_top_searches")
        .then(response => response.json())
        .then(data => {
            const topSearches = data.top_searches;

            // Populate the top search containers
            for (let i = 0; i < topSearches.length; i++) {
                const container = document.getElementById(`top-search-${i + 1}`);
                if (container) {
                    const profession = topSearches[i];

                    // Update the container content
                    container.querySelector(".text").textContent = profession.name;
                    container.querySelector(".hidden-para").textContent = profession.description;

                    // Update the image dynamically
                    const imageElement = container.querySelector(".img");
                    if (profession.image) {
                        imageElement.src = profession.image; // Set the image source dynamically
                    } else {
                        imageElement.src = "{{ url_for('static', filename='images/default.png') }}"; // Fallback image
                    }

                    // Update the "Read more" button link
                    const readMoreButton = container.querySelector(".hidden-btn");
                    readMoreButton.addEventListener("click", () => {
                        window.location.href = `/details?id=${profession.id}`;
                    });
                }
            }
        })
        .catch(error => {
            console.error("Error fetching top searches:", error);
        });
});

// Hover effect for purple containers
const containers = document.querySelectorAll('.purple-container div');

containers.forEach(container => {
    container.addEventListener('mouseover', () => {
        containers.forEach(c => {
            if (c !== container) {
                c.style.display = 'none';
            }
        });
    });

    container.addEventListener('mouseout', () => {
        containers.forEach(c => {
            c.style.display = 'block';
        });
    });
});
