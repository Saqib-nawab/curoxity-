import { useState } from 'react';

const imgIcon4 = "/assets/49eae7506b2a71eaba08e41655f812409049e171.svg";

// Inline SVG icons
function UpArrowIcon({ className, color = "#99a9c0" }: { className?: string; color?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4.667 9.333 8 6l3.333 3.333" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function DownArrowIcon({ className, color = "#99a9c0" }: { className?: string; color?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M11.333 6.667 8 10 4.667 6.667" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CommentIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M14 7.667a5.4 5.4 0 0 1-.58 2.453 5.667 5.667 0 0 1-5.087 3.213 5.4 5.4 0 0 1-2.453-.58L2 14l1.247-3.88A5.4 5.4 0 0 1 2.667 7.667a5.667 5.667 0 0 1 3.213-5.087A5.4 5.4 0 0 1 8.333 2h.334A5.653 5.653 0 0 1 14 7.333v.334Z" stroke="#4a5568" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function MoreDotsIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="8" cy="3" r="1.2" fill="#99a9c0" />
      <circle cx="8" cy="8" r="1.2" fill="#99a9c0" />
      <circle cx="8" cy="13" r="1.2" fill="#99a9c0" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M13.333 4 6 11.333 2.667 8" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

interface Comment {
  id: string;
  userName: string;
  badge: string | null;
  timeAgo: string;
  text: string;
  votes: number;
  voteStatus: 'up' | 'down' | 'none';
  replyCount: number;
  avatarInitial: string;
  avatarGradient: string;
  showReplies: boolean;
  replies?: Comment[];
}

const initialDiscussionData: Comment[] = [
  {
    id: "1",
    userName: "Dr. Sarah Chen",
    badge: "Verified Doctor",
    timeAgo: "2 days ago",
    text: "This Phase I study represents an important advancement in pediatric pleural malignancy treatment. The use of hyperthermic cisplatin (HITC) at escalating doses is particularly noteworthy. For those considering similar approaches, note that the starting dose of 120 mg/m² with strict temperature control (41°C ±0.5°C) demonstrates the careful safety parameters required for this vulnerable population.",
    votes: 12,
    voteStatus: 'up',
    replyCount: 1,
    avatarInitial: "SC",
    avatarGradient: "linear-gradient(135deg, #7DC4F0 0%, #5c88da 100%)",
    showReplies: true,
    replies: [
      {
        id: "1-1",
        userName: "ResearchCoordinator_TX",
        badge: null,
        timeAgo: "1 day ago",
        text: "Thank you for highlighting this, Dr. Chen. We worked on this trial and the temperature monitoring was indeed critical. Every 0.5°C deviation triggered a protocol review. The sample size of 7 is small but appropriate for MTD determination in this rare pediatric indication.",
        votes: 1,
        voteStatus: 'down',
        replyCount: 0,
        avatarInitial: "RC",
        avatarGradient: "linear-gradient(135deg, #7DC4F0 0%, #5c88da 100%)",
        showReplies: false,
        replies: [],
      }
    ],
  },
  {
    id: "2",
    userName: "Dr. Michael Rodriguez",
    badge: "Verified Doctor",
    timeAgo: "3 days ago",
    text: "While this trial focuses on pediatric patients, the cisplatin dosing strategy and HITC technique may inform adult NSCLC approaches, particularly for pleural involvement. However, extrapolation requires caution given the significant physiological differences between pediatric and adult populations. Has anyone seen similar hyperthermic approaches in adult trials?",
    votes: 1,
    voteStatus: 'none',
    replyCount: 1,
    avatarInitial: "MR",
    avatarGradient: "linear-gradient(135deg, #7DC4F0 0%, #5c88da 100%)",
    showReplies: false,
    replies: [
      {
        id: "2-1",
        userName: "Dr. Emily Nakamura",
        badge: "Verified Doctor",
        timeAgo: "1 day ago",
        text: "Great question, Dr. Rodriguez. There are adult NSCLC trials exploring hyperthermic intrapleural chemotherapy, though the dosing and patient selection criteria differ substantially. The pediatric data here is valuable for understanding toxicity patterns, but you're right that direct translation is limited.",
        votes: 1,
        voteStatus: 'none',
        replyCount: 0,
        avatarInitial: "EN",
        avatarGradient: "linear-gradient(135deg, #7DC4F0 0%, #5c88da 100%)",
        showReplies: false,
        replies: [],
      }
    ],
  },
  {
    id: "3",
    userName: "ClinicalPharmacist_Boston",
    badge: null,
    timeAgo: "5 days ago",
    text: "From a pharmacokinetic perspective, the 60-minute perfusion time and antiemetic co-administration are interesting protective strategies. Would love to see the detailed safety data to understand the renal protection efficacy.",
    votes: 1,
    voteStatus: 'none',
    replyCount: 0,
    avatarInitial: "CP",
    avatarGradient: "linear-gradient(135deg, #99a9c0 0%, #4a5568 100%)",
    showReplies: false,
    replies: [],
  },
  {
    id: "4",
    userName: "PatientAdvocate_LungCancer",
    badge: null,
    timeAgo: "7 days ago",
    text: "For those searching for adult NSCLC trials in Germany (as I notice this was the original search context), this trial's completed status and pediatric focus means it won't be a match for adult enrollment. However, understanding cisplatin-based approaches across age groups can be valuable for informed discussions with your oncologist about treatment options.",
    votes: 1,
    voteStatus: 'none',
    replyCount: 1,
    avatarInitial: "PA",
    avatarGradient: "linear-gradient(135deg, #99a9c0 0%, #4a5568 100%)",
    showReplies: false,
    replies: [],
  },
];

function VoteButton({ votes, voteStatus, onUpvote, onDownvote }: {
  votes: number,
  voteStatus: 'up' | 'down' | 'none',
  onUpvote: () => void,
  onDownvote: () => void
}) {
  const isUp = voteStatus === 'up';
  const isDown = voteStatus === 'down';

  return (
    <div className="bg-[rgba(255,255,255,0.4)] border border-solid border-white relative rounded-[16px] shrink-0">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[4px] items-center px-[6px] py-[4px] relative">
        <button
          onClick={onUpvote}
          className="p-0 border-none bg-transparent cursor-pointer flex items-center group"
          title="Upvote"
        >
          <UpArrowIcon className="shrink-0 size-[16px]" color={isUp ? "#7DC4F0" : "#99a9c0"} />
        </button>
        <p className={`font-noto-sans leading-[16px] relative shrink-0 text-[12px] text-center whitespace-nowrap min-w-[12px] 
          ${isUp ? 'text-brand-primary font-bold' : isDown ? 'text-[#f45954] font-bold' : 'text-text-secondary font-normal'}`}
        >
          {votes}
        </p>
        <button
          onClick={onDownvote}
          className="p-0 border-none bg-transparent cursor-pointer flex items-center group"
          title="Downvote"
        >
          <DownArrowIcon className="shrink-0 size-[16px]" color={isDown ? "#f45954" : "#99a9c0"} />
        </button>
      </div>
    </div>
  );
}

function CommentCard({
  comment,
  onVote,
  onToggleReplies,
  onReply
}: {
  comment: Comment,
  onVote: (id: string, type: 'up' | 'down') => void,
  onToggleReplies: (id: string) => void,
  onReply: (id: string) => void
}) {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full">
      <div className={`bg-[rgba(255,255,255,0.4)] border border-solid border-white content-stretch flex flex-col gap-[16px] items-start p-[16px] md:p-[20px] relative rounded-[16px] shrink-0 w-full`}>
        <div className="content-stretch flex items-start justify-between relative shrink-0 w-full">
          <div className="relative shrink-0 min-w-0">
            <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[12px] items-center relative">
              <div className="relative rounded-[26843500px] shrink-0 size-[36px] md:size-[48px]" style={{ backgroundImage: comment.avatarGradient }}>
                <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
                  <p className="font-inter font-semibold leading-[20px] relative shrink-0 text-[11px] md:text-[14px] text-white whitespace-nowrap">
                    {comment.avatarInitial}
                  </p>
                </div>
              </div>
              <div className="relative shrink-0 min-w-0">
                <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[4px] items-start relative">
                  <div className="content-stretch flex flex-wrap gap-[8px] items-center relative shrink-0">
                    <p className="font-noto-sans font-normal leading-[28px] relative shrink-0 text-text-primary text-[14px] md:text-[16px] whitespace-nowrap">
                      {comment.userName}
                    </p>
                    {comment.badge && (
                      <div className="bg-[#14b8a6] relative rounded-[26843500px] shrink-0">
                        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center px-[8px] py-[4px] relative">
                          <p className="font-noto-sans font-medium leading-[16px] relative shrink-0 text-[12px] text-white tracking-[0.36px] whitespace-nowrap">
                            {comment.badge}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                  <p className="font-noto-sans font-normal leading-[16px] relative shrink-0 text-text-secondary text-[12px]">
                    {comment.timeAgo}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <MoreDotsIcon className="relative shrink-0 size-[16px] cursor-pointer" />
        </div>

        <p className="font-noto-sans font-normal leading-[20px] relative shrink-0 text-text-secondary text-[14px] w-full">
          {comment.text}
        </p>

        <div className="content-stretch flex flex-wrap gap-[16px] items-center relative shrink-0 w-full">
          <VoteButton
            votes={comment.votes}
            voteStatus={comment.voteStatus}
            onUpvote={() => onVote(comment.id, 'up')}
            onDownvote={() => onVote(comment.id, 'down')}
          />
          {comment.replyCount > 0 && (
            <button
              onClick={() => onToggleReplies(comment.id)}
              className="relative shrink-0 cursor-pointer border-none bg-transparent p-0 flex items-center gap-[6px]"
            >
              <div className={`transition-transform duration-200 ${comment.showReplies ? 'rotate-180' : ''}`}>
                <DownArrowIcon className="shrink-0 size-[16px]" color="#4a5568" />
              </div>
              <p className="font-noto-sans font-normal leading-[16px] relative shrink-0 text-text-secondary text-[12px] text-center whitespace-nowrap">
                {comment.replyCount} {comment.replyCount === 1 ? 'reply' : 'replies'}
              </p>
            </button>
          )}
          <button
            onClick={() => onReply(comment.id)}
            className="relative shrink-0 cursor-pointer border-none bg-transparent p-0 flex items-center gap-[6px]"
          >
            <CommentIcon className="shrink-0 size-[16px]" />
            <p className="font-noto-sans font-normal leading-[16px] relative shrink-0 text-text-secondary text-[12px] text-center whitespace-nowrap">
              Reply
            </p>
          </button>
        </div>
      </div>

      {/* Nested Replies */}
      {comment.showReplies && comment.replies && comment.replies.length > 0 && (
        <div className="content-stretch flex flex-col items-start pl-[32px] md:pl-[64px] relative shrink-0 w-full gap-[16px]">
          {comment.replies.map((reply) => (
            <CommentCard
              key={reply.id}
              comment={reply}
              onVote={onVote}
              onToggleReplies={onToggleReplies}
              onReply={onReply}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function DiscussionTab() {
  const [activeSort, setActiveSort] = useState('Top');
  const [comments, setComments] = useState<Comment[]>(initialDiscussionData);
  const [newCommentText, setNewCommentText] = useState("");
  const sortOptions = ['Top', 'New', 'Most Discussed'];

  const handlePostComment = () => {
    if (!newCommentText.trim()) return;

    const newComment: Comment = {
      id: Date.now().toString(),
      userName: "You",
      badge: null,
      timeAgo: "Just now",
      text: newCommentText,
      votes: 0,
      voteStatus: 'none',
      replyCount: 0,
      avatarInitial: "U",
      avatarGradient: "linear-gradient(135deg, #99a9c0 0%, #4a5568 100%)",
      showReplies: false,
      replies: [],
    };

    setComments([newComment, ...comments]);
    setNewCommentText("");
  };

  const updateNestedComment = (list: Comment[], id: string, updater: (c: Comment) => Comment): Comment[] => {
    return list.map(c => {
      if (c.id === id) return updater(c);
      if (c.replies) return { ...c, replies: updateNestedComment(c.replies, id, updater) };
      return c;
    });
  };

  const handleVote = (id: string, type: 'up' | 'down') => {
    setComments(prev => updateNestedComment(prev, id, (c) => {
      let newVotes = c.votes;
      let newStatus = c.voteStatus;

      if (type === 'up') {
        if (newStatus === 'up') {
          newVotes -= 1;
          newStatus = 'none';
        } else if (newStatus === 'down') {
          newVotes += 2;
          newStatus = 'up';
        } else {
          newVotes += 1;
          newStatus = 'up';
        }
      } else {
        if (newStatus === 'down') {
          newVotes += 1;
          newStatus = 'none';
        } else if (newStatus === 'up') {
          newVotes -= 2;
          newStatus = 'down';
        } else {
          newVotes -= 1;
          newStatus = 'down';
        }
      }

      return { ...c, votes: newVotes, voteStatus: newStatus };
    }));
  };

  const handleToggleReplies = (id: string) => {
    setComments(prev => updateNestedComment(prev, id, (c) => ({ ...c, showReplies: !c.showReplies })));
  };

  const handleReply = (id: string) => {
    console.log(`Replying to comment ${id}`);
    // Simplified for now: just adds "Replying to..." text to top-level input
    // To make it fully interactive, we'd need a nested input.
    setNewCommentText(`@${id} `);
  };

  return (
    <div className="bg-[rgba(255,255,255,0.4)] border border-solid border-white content-stretch flex flex-col gap-[24px] items-start w-full min-w-0 p-[16px] md:p-[25px] relative rounded-[24px]" data-name="Container">

      {/* Section Header */}
      <div className="relative shrink-0 w-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-wrap gap-[12px] items-center justify-between relative w-full">
          <div className="content-stretch flex gap-[10px] items-center justify-center relative shrink-0">
            <div className="bg-[rgba(255,255,255,0.4)] border-[0.471px] border-solid border-white content-stretch flex items-center justify-center p-[8px] relative rounded-[12px] shadow-[-33.882px_60.235px_19.294px_0px_rgba(138,163,239,0),-21.647px_38.588px_17.882px_0px_rgba(138,163,239,0.01),-12.235px_21.647px_15.059px_0px_rgba(138,163,239,0.03),-5.176px_9.412px_10.824px_0px_rgba(138,163,239,0.05),-1.412px_2.353px_6.118px_0px_rgba(138,163,239,0.06)] shrink-0 size-[48px]">
              <div className="content-stretch flex items-center justify-center px-[4px] relative shrink-0 size-[32px]">
                <div className="relative shrink-0 size-[24px]">
                  <img alt="" className="absolute block max-w-none size-full" src={imgIcon4} />
                </div>
              </div>
            </div>
            <div className="flex flex-col font-outfit font-bold justify-center leading-[0] relative shrink-0 text-text-primary text-[0px] whitespace-nowrap">
              <p className="font-outfit font-normal leading-[32px] text-[20px] md:text-[24px]">Discussion Threads</p>
            </div>
          </div>

          {/* Sort Tabs */}
          <div className="content-stretch flex gap-[8px] items-center relative shrink-0">
            <p className="font-noto-sans font-medium leading-[16px] relative shrink-0 text-text-muted text-[12px] tracking-[0.36px] whitespace-nowrap">
              Sort by:
            </p>
            <div className="bg-[#f1f4fb] relative rounded-[10px] shrink-0">
              <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[4px] items-start p-[4px] relative">
                {sortOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => setActiveSort(option)}
                    className={`relative rounded-[8px] shrink-0 border-none cursor-pointer px-[12px] py-[6px] ${activeSort === option ? 'bg-white' : 'bg-transparent'
                      }`}
                  >
                    <p className={`font-noto-sans font-normal leading-[16px] relative shrink-0 text-[12px] text-center whitespace-nowrap ${activeSort === option ? 'text-brand-primary' : 'text-text-secondary'
                      }`}>
                      {option}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Comment Input Box */}
      <div className="border border-dashed border-white relative rounded-[16px] shrink-0 w-full" style={{ backgroundImage: "linear-gradient(171deg, rgba(138, 163, 239, 0.1) 0%, rgba(0, 0, 0, 0) 100%)" }}>
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start p-[18px] relative w-full">
          <div className="content-stretch flex gap-[12px] items-start relative shrink-0 w-full">
            {/* User Avatar */}
            <div className="relative rounded-[26843500px] shrink-0 size-[40px] hidden md:flex items-center justify-center" style={{ backgroundImage: "linear-gradient(135deg, #99a9c0 0%, #4a5568 100%)" }}>
              <p className="font-inter font-semibold leading-[20px] relative shrink-0 text-[14px] text-white whitespace-nowrap">
                U
              </p>
            </div>
            {/* Input Area */}
            <div className="flex-[1_0_0] min-h-px min-w-px relative">
              <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[14px] items-start relative w-full">
                <div className="bg-white border-border-default border-[0.8px] border-solid content-stretch flex items-start overflow-clip px-[16px] py-[12px] relative rounded-[12px] shrink-0 w-full min-h-[86px]">
                  <textarea
                    value={newCommentText}
                    onChange={(e) => setNewCommentText(e.target.value)}
                    placeholder="Start a discussion or ask a question about this trial..."
                    className="font-noto-sans font-normal leading-[20px] relative w-full text-text-muted text-[14px] border-none outline-none resize-none bg-transparent min-h-[60px]"
                  />
                </div>
                <div className="content-stretch flex items-end justify-end relative shrink-0 w-full">
                  <button
                    onClick={handlePostComment}
                    className="bg-brand-primary relative rounded-[12px] shrink-0 border-none cursor-pointer"
                  >
                    <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center justify-center px-[16px] py-[8px] relative">
                      <CheckIcon className="shrink-0 size-[16px]" />
                      <p className="font-noto-sans font-normal leading-[20px] relative shrink-0 text-[14px] text-center text-white whitespace-nowrap">
                        Post Comment
                      </p>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Comments List */}
      <div className="relative shrink-0 w-full text-left">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[16px] items-start relative w-full">
          {comments.map((comment) => (
            <CommentCard
              key={comment.id}
              comment={comment}
              onVote={handleVote}
              onToggleReplies={handleToggleReplies}
              onReply={handleReply}
            />
          ))}
        </div>
      </div>

      {/* Load More Button */}
      <button className="bg-[rgba(255,255,255,0.4)] border border-solid border-white relative rounded-[12px] shrink-0 cursor-pointer">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center justify-center px-[16px] py-[8px] relative">
          <p className="font-noto-sans font-normal leading-[20px] relative shrink-0 text-text-secondary text-[14px] text-center whitespace-nowrap">
            Load more comments
          </p>
        </div>
      </button>
    </div>
  );
}
