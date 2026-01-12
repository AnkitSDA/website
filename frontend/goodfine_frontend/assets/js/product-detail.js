console.log("✅ product-detail.js loaded");

$(document).ready(function () {

    const params = new URLSearchParams(window.location.search);
    const productId = params.get("id");

    console.log("Product ID:", productId);

    if (!productId) {
        console.error("❌ Product ID missing");
        return;
    }

    $.get("http://localhost:5000/api/products/" + productId)
        .done(function (product) {

            console.log("✅ API Response:", product);

            /* -----------------
               PRODUCT NAME
            ------------------ */
            $("#product-title").text(product.name);
            $("#product-name").text(product.name);

            /* -----------------
               PRODUCT IMAGE
               (FIXED HERE)
            ------------------ */
            if (product.image) {
                const imgUrl =
                    "http://localhost:5000/uploads/products/" + product.image;

                console.log("Image URL:", imgUrl);

                $("#product-image")
                    .attr("src", imgUrl)
                    .attr("alt", product.name);
            }

            /* -----------------
               PRODUCT DESCRIPTION
               (HTML + TEXT)
            ------------------ */
            let html = "";

            // short_description (HTML table – escaped already safe)
            if (product.short_description) {
                html += product.short_description;
            }

            // long description
            if (product.description) {
                html += `<p style="margin-top:20px;">${product.description}</p>`;
            }

            $("#product-description").html(html);

        })
        .fail(function (err) {
            console.error("❌ API failed", err);
        });

});
