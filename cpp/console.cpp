#include "movie.hpp"
#include <iostream>
#include <limits>

// getline + a stream avoids leaving cin in a failed state after bad input.
bool readNumber(const std::string& prompt,double& result) {
    for(std::string line;;){
        std::cout<<prompt;
        if(!std::getline(std::cin,line))return false;
        std::istringstream input(line);std::string extra;
        if(input>>result && !(input>>extra) && std::isfinite(result))return true;
        std::cout<<"Please enter a valid number.\n";
    }
}
bool readText(const std::string& prompt,std::string& text){std::cout<<prompt;return bool(std::getline(std::cin,text));}
void display(const frame::Catalog& catalog) {
    std::cout<<"\nMOVIE RATING SYSTEM\n"<<std::string(76,'-')<<'\n';
    double sum=0;int rated=0;
    // Loop through multiple objects and display all required movie information.
    for(const auto& movie:catalog.movies()) {
        std::cout<<movie.id()<<". "<<movie.title()<<" ("<<movie.year()<<") | "<<movie.genre()<<"\n   ";
        if(movie.rated()) {std::cout<<std::fixed<<std::setprecision(1)<<movie.rating()<<"/10";sum+=movie.rating();++rated;}
        else std::cout<<"Unrated";
        std::cout<<" | "<<movie.status()<<'\n';
        if(!movie.review().empty())std::cout<<"   "<<movie.review()<<'\n';
    }
    if(rated)std::cout<<"Average rating: "<<std::fixed<<std::setprecision(2)<<sum/rated<<"/10 ("<<rated<<" rated movies)\n";
    else std::cout<<"Average rating: N/A (no rated movies)\n";
}
int main() {
    frame::Catalog catalog(true); // Creates nine Movie objects using the constructor.
    std::cout<<"Ratings >= 7 are recommended. Use 0 for an unrated watchlist movie.\n";
    display(catalog);
    while(true) {
        double choice;
        if(!readNumber("\n1 List  2 Add  3 Edit  4 Delete  5 Search  6 Stats  0 Exit\nChoice: ",choice))break;
        if(choice==0)break;
        else if(choice==1)display(catalog);
        else if(choice==2 || choice==3) {
            double id=0,year,rating;std::string title,genre,review;
            if(choice==3 && !readNumber("Movie ID: ",id))break;
            if(!readText("Title: ",title) || !readText("Genre (Drama/Sci-Fi/Thriller/Animation/Comedy/Action/Documentary/Horror/Romance/Other): ",genre)
               || !readNumber("Year: ",year) || !readNumber("Rating (1-10, or 0 for watchlist): ",rating) || !readText("Review (optional): ",review))break;
            if(year<1888 || year>2100 || year!=std::floor(year) || id<0 || id>1000000000 || id!=std::floor(id)){std::cout<<"Invalid integer year or ID.\n";continue;}
            bool ok=choice==2?catalog.add(title,genre,int(year),rating,review):catalog.update(int(id),title,genre,int(year),rating,review);
            std::cout<<(ok?"Movie saved.":catalog.lastError())<<'\n';
        }
        else if(choice==4){double id;if(!readNumber("Movie ID: ",id))break;
            if(id<1 || id>1000000000 || id!=std::floor(id)){std::cout<<"Invalid ID.\n";continue;}
            std::cout<<(catalog.remove(int(id))?"Movie deleted.":catalog.lastError())<<'\n';}
        else if(choice==5){std::string term;if(!readText("Search title, year, or review: ",term))break;
            std::cout<<catalog.query(term,"All genres","all","title")<<'\n';}
        else if(choice==6)std::cout<<catalog.stats()<<'\n';
        else std::cout<<"Choose a menu option from 0 to 6.\n";
    }
    std::cout<<"Goodbye! Console changes are session-only; the web app supports saved catalogs.\n";
}
