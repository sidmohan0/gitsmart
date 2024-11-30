import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PrData } from "@/types/github";

interface PRReviewsProps {
  reviews: PrData['reviews'];
  comments: PrData['comments'];
}

export default function PRReviews({ reviews, comments }: PRReviewsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Reviews & Comments</CardTitle>
        <CardDescription>
          {reviews.length} reviews · {comments.length} comments
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {reviews.length > 0 && (
            <div>
              <h3 className="font-medium mb-4">Reviews</h3>
              <div className="space-y-4">
                {reviews.map((review, index) => (
                  <div key={index} className="border-b pb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-medium">{review.user.login}</span>
                      <span className="text-sm capitalize">{review.state.toLowerCase()}</span>
                    </div>
                    {review.body && <p>{review.body}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {comments.length > 0 && (
            <div>
              <h3 className="font-medium mb-4">Comments</h3>
              <div className="space-y-4">
                {comments.map((comment, index) => (
                  <div key={index} className="border-b pb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-medium">{comment.user.login}</span>
                      <span className="text-sm text-muted-foreground">
                        {new Date(comment.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p>{comment.body}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
