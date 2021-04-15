pragma solidity ^0.8.0;

import "./VotingDomain.sol";

contract ElectionTallyContract {
    uint candidate_key_length = 10;
    struct ElectionTally{
        uint total_votes;
        mapping(string => uint) candidate_votes;
    }


    mapping (string => mapping(string => VotingDomain.Vote)) votes;
    mapping (string => ElectionTally) tallies;


    function submitVoteFragments(string memory election_id, VotingDomain.VoteFragment[] memory fragments) public {
        
        for (uint i = 0; i < fragments.length; i++) {
            VotingDomain.VoteFragment memory fragment = fragments[i];

            // in storage, gather/reconstruct vote from fragments
            VotingDomain.Vote storage vote = votes[election_id][fragment.vote_id];
            vote.fragments.push(fragment);


            if(bytes(vote.id).length == 0){ //attach vote to votes storage
                vote.id = fragment.vote_id;
                votes[election_id][fragment.vote_id] = vote;    
            }
            
            if(vote.fragments.length >= candidate_key_length){
                //reorder the candidate key fragments (sort)
                bytes memory candidate_key = new bytes(candidate_key_length);
                for(uint j=0; j <= vote.fragments.length; j++){
                    candidate_key[vote.fragments[j].candidate_key_fragment_position] = bytes(vote.fragments[j].candidate_key_fragment)[0];
                }
                //if valid candidate key, tally vote
                if(true){ //TODO: Ensure candidate is valid
                    tallies[election_id].candidate_votes[string(candidate_key)] += 1;
                    tallies[election_id].total_votes += 1;

                }
                
            }
        }

    }


   function getTally(string memory election_id) public view returns (uint, uint, string[] memory, uint[] memory) {
        return (tallies[election_id].total_votes,tallies[election_id].candidate_votes[election_id], new string[](1), new uint[](1));
}
}
