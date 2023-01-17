let selected;
let selectedRating = 6;

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        let r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function createElement(feedbackItem) {
    let feedbackContainer = document.querySelector('.feedback');

    let container = document.createElement('div');
    container.classList = "p-2 bg-[#e0e1dd] my-5 sm:p-5 sm:rounded-lg";
    container.id = feedbackItem.id;

    let contentContainer = document.createElement('div');

    let rating = document.createElement('div');
    rating.classList = "w-10 h-10 rounded-full bg-[#fb6f92] flex justify-center items-center text-[#e0e1dd]"

    let ratingValue = document.createElement('p');
    ratingValue.innerText = feedbackItem.feedbackRating;

    let content = document.createElement('h2');
    content.innerText = feedbackItem.feedbackContent;
    content.classList = 'text-xl my-2 break-words';

    let uppContainer = document.createElement('div');
    uppContainer.classList = "flex justify-between";

    let btnContainer = document.createElement('div');
    btnContainer.classList = "flex justify-between";

    let deleteBtn = document.createElement('button');
    deleteBtn.innerText = 'x';
    deleteBtn.classList = "text-xl deleteBtn";

    let updateBtn = document.createElement('button');
    updateBtn.innerText = 'update';
    updateBtn.classList = "text-xl ml-5 updateBtn";
    
    rating.appendChild(ratingValue);
    uppContainer.appendChild(rating);
    contentContainer.appendChild(content);
    btnContainer.appendChild(deleteBtn);
    btnContainer.appendChild(updateBtn);
    uppContainer.appendChild(btnContainer);
    container.appendChild(uppContainer);
    container.appendChild(contentContainer);
    feedbackContainer.appendChild(container);
}

function clickFunctions() {
    document.querySelectorAll('.rating').forEach(rating => {
        rating.addEventListener('click', () => {
            document.querySelectorAll('.rating').forEach(rate => {
                rate.classList.remove('bg-[#fb6f92]');
            }) 
            rating.classList.add('bg-[#fb6f92]');
            selectedRating = rating.childNodes[1].innerText;
        })
    })

    document.querySelector('.addBtn').addEventListener('click', (e) => {
        let feedbackName = document.querySelector('.feedbackName').value;
        if(e.target.innerText == "ADD") {
            addFeedback(feedbackName, selectedRating);
            selectedRating = 6;
            document.querySelectorAll('.rating').forEach(rate => {
                rate.classList.remove('bg-[#fb6f92]');
            }) 
            document.querySelector('.feedbackName').value = '';
        } else {
            updateFeedback(selected.id, feedbackName, selectedRating, selected.feedbackContainer);
            document.querySelector('.feedbackName').value = '';
            document.querySelectorAll('.rating').forEach(rate => {
                rate.classList.remove('bg-[#fb6f92]');
            }) 
            document.querySelector('.addBtn').innerText = "Add";
        }
    })

    document.querySelectorAll('.deleteBtn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            if(e.target.parentNode.parentNode.parentNode) {
                e.target.parentNode.parentNode.parentNode.parentNode.removeChild(e.target.parentNode.parentNode.parentNode);
                deleteFeedback(e.target.parentNode.parentNode.parentNode.id);
            }
        })
    })

    document.querySelectorAll('.updateBtn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelector('.feedbackName').value = e.target.parentNode.parentNode.parentNode.childNodes[1].innerText;
            selected = {id: e.target.parentNode.parentNode.parentNode.id, feedbackContainer: e.target.parentNode.parentNode.parentNode};
            selectedRating = e.target.parentNode.parentNode.childNodes[0].childNodes[0].innerText;
            document.querySelectorAll('.rating').forEach(rate => {
                if(rate.childNodes[1].innerText == selectedRating) {
                    rate.classList.add('bg-[#fb6f92]');
                }
            }) 
            document.querySelector('.addBtn').innerText = "Update";
        })
    })
}

function getFeedback() {
    let feedback = JSON.parse(localStorage.getItem('feedback') || '[]');
    return feedback;
}

function addFeedback(feedbackContent, feedbackRating) {
    if(feedbackContent != '') {
        let id = uuidv4();
        let obj = {
            id,
            feedbackContent,
            feedbackRating
        }

        let feedback = getFeedback();
        feedback.push(obj);
        
        localStorage.setItem('feedback', JSON.stringify(feedback));
        createElement(obj);
        clickFunctions();
    }
}

function deleteFeedback(feedbackID) {
    let feedback = getFeedback();
    let newfeedback = feedback.filter((feedbackItem) => {
        if(feedbackItem.id != feedbackID) {
            return feedbackItem;
        }
    })

    localStorage.removeItem('feedback');
    localStorage.setItem('feedback', JSON.stringify(newfeedback));
}

function updateFeedback(feedbackID, feedbackContent, feedbackRating, feedbackContainer) {
    if(feedbackContent != '') {
        let feedback = getFeedback();
        
        feedback.forEach(feedbackItem => {
            if(feedbackID == feedbackItem.id) {
                feedbackItem.feedbackContent = feedbackContent;
                feedbackItem.feedbackRating = feedbackRating;
            }
        })

        localStorage.setItem('feedback', JSON.stringify(feedback));

        console.log(feedbackContainer.childNodes[0].childNodes[0])
        feedbackContainer.childNodes[0].childNodes[0].childNodes[0].innerText = feedbackRating;
        feedbackContainer.childNodes[1].childNodes[0].innerText = feedbackContent;
    }
}

function showFeedback() {
    let feedback = getFeedback();
    let avg = 0;
    feedback.forEach(feedbackItem => {
        avg += Number(feedbackItem.feedbackRating);
        createElement(feedbackItem);
    })
    
    document.querySelector('.count').innerText = `${feedback.length} reviews`;
    document.querySelector('.avg').innerText = `Average rating: ${avg/feedback.length}`;


}

showFeedback();
clickFunctions();