const Review = require("../Model/review.js");
module.exports.reviewListing = async (req, res) => {
    try {
        let newReview = new Review(req.body.Review);
        newReview.author = req.user._id;

        await newReview.save();
        
        req.flash("success", "New review added");

        

        res.redirect("/review"); 
    } catch (error) {
        console.error("Error adding review:", error);
        req.flash("error", "Could not add review");
        res.redirect("back"); 
    }
};

module.exports.deleteReview = async (req, res) => {
    try {
        let { revId } = req.params;

        await Review.findByIdAndDelete(revId);
        req.flash("success", "Review deleted");

        res.redirect("/review"); 
    } catch (error) {
        console.error("Error deleting review:", error);
        req.flash("error", "Could not delete review");
        res.redirect("back"); 
    }
};
