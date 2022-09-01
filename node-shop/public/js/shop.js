/**
    Send DELETE request to remove a product 
    with provided id from cart items

    @param btn botton object
    @param prodId product id to remove 
*/
const deleteCartItem = async (btn, prodId) => {
  const csrf = btn.parentNode.querySelector("[name=_csrf]").value;
  const productElement = btn.closest("li");
  const cartElement = btn.closest("ul");
  const mainElement = btn.closest("main");

  try {
    const result = await fetch("/cart/items/" + prodId, {
      method: "DELETE",
      headers: {
        "csrf-token": csrf,
      },
    });

    const data = await result.json();
    console.log(data);
    productElement.parentNode.removeChild(productElement);
    
    // check if cart items is empty
    if (cartElement.childElementCount == 0) {
      mainElement.innerHTML = `<h1 style="background-color:lightyellow;">
        No Products In Cart!
    </h1>`;
    };

  } catch (err) {
    console.log(err);
  };

};
