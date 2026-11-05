#pragma once
#include <algorithm>
#include <cmath>
#include <cctype>
#include <iomanip>
#include <sstream>
#include <string>
#include <vector>

namespace frame {
// JSON is emitted by C++; the browser only parses it for display and storage.
inline std::string quote(const std::string& text) {
    std::ostringstream out; out << '"';
    for (unsigned char c : text) {
        if (c == '"' || c == '\\') out << '\\' << c;
        else if (c < 32) out << "\\u" << std::hex << std::setw(4) << std::setfill('0') << int(c) << std::dec;
        else out << c;
    }
    out << '"'; return out.str();
}
inline std::string trim(std::string s) {
    auto space=[](unsigned char c){ return std::isspace(c); };
    s.erase(s.begin(), std::find_if_not(s.begin(), s.end(), space));
    s.erase(std::find_if_not(s.rbegin(), s.rend(), space).base(), s.end());
    return s;
}
inline std::string lower(std::string s) {
    for (char& c:s) c=static_cast<char>(std::tolower(static_cast<unsigned char>(c)));
    return s;
}
// Encapsulation: data is private; public methods provide controlled access.
class Movie {
private:
    int id_, year_;
    std::string title_, genre_, review_;
    double rating_;
public:
    // Parameterized constructor assigns each movie's information.
    Movie(int id, std::string title, std::string genre, int year, double rating, std::string review)
        : id_(id), year_(year), title_(trim(title)), genre_(genre), review_(trim(review)), rating_(rating) {}
    int id() const { return id_; }
    int year() const { return year_; }
    double rating() const { return rating_; }
    const std::string& title() const { return title_; }
    const std::string& genre() const { return genre_; }
    const std::string& review() const { return review_; }
    bool rated() const { return rating_ > 0; }
    std::string status() const {
        if (!rated()) return "Not rated";
        else if (rating_ >= 7.0) return "Recommended";
        else return "Not recommended";
    }
    std::string json() const {
        std::ostringstream o;
        o << "{\"id\":" << id_ << ",\"title\":" << quote(title_) << ",\"genre\":" << quote(genre_)
          << ",\"year\":" << year_ << ",\"rating\":" << rating_ << ",\"review\":" << quote(review_)
          << ",\"status\":" << quote(status()) << '}';
        return o.str();
    }
};

class Catalog {
private:
    std::vector<Movie> movies_;
    int nextId_=1;
    std::string error_;
    bool valid(const std::string& title,const std::string& genre,int year,double rating,const std::string& review) {
        error_.clear();
        const std::vector<std::string> genres={"Drama","Sci-Fi","Thriller","Animation","Comedy","Action","Documentary","Horror","Romance","Other"};
        if (trim(title).empty() || title.size()>160) error_="Title must contain 1 to 160 UTF-8 bytes.";
        else if (std::find(genres.begin(),genres.end(),genre)==genres.end()) error_="Choose a valid genre.";
        else if (year<1888 || year>2100) error_="Year must be between 1888 and 2100.";
        else if (!std::isfinite(rating) || (rating!=0 && (rating<1 || rating>10)) || std::abs(rating*10-std::round(rating*10))>0.00001) error_="Use a rating from 1 to 10 in steps of 0.1, or 0 for the watchlist.";
        else if (review.size()>2000) error_="Review must be at most 2000 UTF-8 bytes.";
        // Reject hidden ASCII controls while allowing tabs and newlines in reviews.
        for(unsigned char c:title) if(c<32 || c==127) error_="Title cannot contain control characters.";
        return error_.empty();
    }
public:
    explicit Catalog(bool sample=false) { if (sample) seed(); }
    std::string lastError() const { return error_; }
    const std::vector<Movie>& movies() const { return movies_; }
    bool restore(int id,const std::string& title,const std::string& genre,int year,double rating,const std::string& review) {
        if (!valid(title,genre,year,rating,review)) return false;
        if(id<1 || id>1000000000) {error_="Invalid movie ID.";return false;}
        if(movies_.size()>=500) {error_="Your catalog can hold up to 500 movies.";return false;}
        for(const auto& m:movies_) if(m.id()==id) {error_="Duplicate movie ID.";return false;}
        movies_.emplace_back(id,title,genre,year,rating,review);
        nextId_=std::max(nextId_,id+1); return true;
    }
    bool add(const std::string& title,const std::string& genre,int year,double rating,const std::string& review) {
        return restore(nextId_,title,genre,year,rating,review);
    }
    bool update(int id,const std::string& title,const std::string& genre,int year,double rating,const std::string& review) {
        if (!valid(title,genre,year,rating,review)) return false;
        for(auto& movie:movies_) if(movie.id()==id) { movie=Movie(id,title,genre,year,rating,review);return true; }
        error_="Movie was not found.";return false;
    }
    bool remove(int id) {
        for(auto i=movies_.begin();i!=movies_.end();++i) if(i->id()==id) {movies_.erase(i);error_.clear();return true;}
        error_="Movie was not found.";return false;
    }
    void seed() {
        movies_.clear();nextId_=1;error_.clear();
        // Each call constructs a different Movie object. These ratings are examples.
        add("Interstellar","Sci-Fi",2014,9.2,"A moving journey through space, time, and the things that bring us home.");
        add("The Grand Budapest Hotel","Comedy",2014,8.6,"Every frame feels like a postcard. Funny, precise, and unexpectedly tender.");
        add("Spirited Away","Animation",2001,9.4,"A strange, beautiful world that rewards getting completely lost in it.");
        add("The Dark Knight","Action",2008,9.0,"Tense from the first scene, with an unforgettable central performance.");
        add("Past Lives","Romance",2023,8.3,"Small gestures, big feelings. A quiet story that stays with you.");
        add("The Matrix","Sci-Fi",1999,8.8,"A bold premise and action scenes that still feel electric.");
        add("Tenet","Thriller",2020,6.4,"Inventive set pieces, but the story kept me at a distance.");
        add("Dune Part Two","Sci-Fi",2024,0,"");
        add("The Truman Show","Drama",1998,0,"");
    }
    // All search, filter, and sort decisions execute in C++ for both targets.
    std::string query(const std::string& search,const std::string& genre,const std::string& view,const std::string& sort) const {
        std::vector<Movie> result;
        const auto needle=lower(trim(search));
        for(const auto& m:movies_) {
            if(!needle.empty() && lower(m.title()+" "+m.review()+" "+std::to_string(m.year())).find(needle)==std::string::npos) continue;
            if(genre!="All genres" && genre!=m.genre()) continue;
            if(view=="recommended" && (!m.rated() || m.rating()<7)) continue;
            if(view=="watchlist" && m.rated()) continue;
            if(view=="not-recommended" && (!m.rated() || m.rating()>=7)) continue;
            result.push_back(m);
        }
        std::sort(result.begin(),result.end(),[&](const Movie& a,const Movie& b){
            if(sort=="title") {if(lower(a.title())!=lower(b.title()))return lower(a.title())<lower(b.title());}
            else if(sort=="year") {if(a.year()!=b.year())return a.year()>b.year();}
            else if(sort=="rating") {if(a.rating()!=b.rating())return a.rating()>b.rating();}
            return a.id()>b.id();
        });
        std::string out="[";bool first=true;
        for(const auto& m:result){if(!first)out+=",";first=false;out+=m.json();}return out+"]";
    }
    std::string snapshot() const {return "{\"version\":1,\"movies\":"+query("","All genres","all","newest")+"}";}
    std::string stats() const {
        double total=0,best=0;int count=0,recommended=0,bestId=0;
        for(const auto& m:movies_) if(m.rated()) {
            total+=m.rating();++count;if(m.rating()>=7)++recommended;
            if(m.rating()>best || (m.rating()==best && (bestId==0 || m.id()<bestId))){best=m.rating();bestId=m.id();}
        }
        std::ostringstream o;
        o<<"{\"total\":"<<movies_.size()<<",\"rated\":"<<count<<",\"watchlist\":"<<(movies_.size()-count)
         <<",\"recommended\":"<<recommended<<",\"average\":"<<(count?total/count:0)
         <<",\"bestId\":"<<bestId<<",\"bestRating\":"<<best<<",\"distribution\":[";
        for(int bucket=1;bucket<=10;++bucket){int n=0;for(const auto& m:movies_)if(m.rated() && static_cast<int>(std::ceil(m.rating()))==bucket)++n;if(bucket>1)o<<',';o<<n;}
        o<<"],\"genres\":[";
        const std::vector<std::string> genres={"Drama","Sci-Fi","Thriller","Animation","Comedy","Action","Documentary","Horror","Romance","Other"};
        bool first=true;
        for(const auto& g:genres){int n=0;for(const auto& m:movies_)if(m.genre()==g)++n;
            if(n){if(!first)o<<',';first=false;o<<"{\"name\":"<<quote(g)<<",\"count\":"<<n<<'}';}}
        o<<"]}";return o.str();
    }
};
} // namespace frame
