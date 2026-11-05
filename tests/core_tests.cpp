#include "../cpp/movie.hpp"
#include <cassert>
#include <iostream>
int main(){
    frame::Movie a(1,"A","Drama",2000,6.9,"");
    frame::Movie b(2,"B","Drama",2000,7.0,"");
    frame::Movie c(3,"C","Drama",2000,0,"");
    assert(a.status()=="Not recommended" && b.status()=="Recommended" && c.status()=="Not rated");
    frame::Catalog db;
    assert(db.stats().find("\"average\":0")!=std::string::npos);
    assert(!db.add(" ","Drama",2000,8,""));
    assert(!db.add("A","Drama",2000,std::nan(""),""));
    assert(!db.add("A","Drama",2000,6.95,""));
    assert(!db.add("A","Drama",2000,0.5,""));
    assert(!db.add("A","NoSuchGenre",2000,8,""));
    assert(!db.add("A","Drama",1800,8,""));
    assert(db.add("A \"quoted\" title","Drama",2000,8,"Line one\nLine two"));
    assert(db.add("B","Sci-Fi",2001,6,""));assert(db.add("C","Drama",2002,0,""));
    assert(db.stats().find("\"average\":7")!=std::string::npos);
    assert(db.stats().find("\"watchlist\":1")!=std::string::npos);
    assert(db.query("QUOTED","All genres","all","title").find("quoted")!=std::string::npos);
    assert(db.query("","All genres","recommended","rating").find("\"id\":2")==std::string::npos);
    assert(db.query("","Sci-Fi","watchlist","rating")=="[]");
    auto snapshot=db.snapshot();assert(!db.update(1,"","Drama",2000,8,""));assert(snapshot==db.snapshot());
    assert(db.update(1,"Updated","Drama",2020,7,""));assert(db.remove(2));assert(!db.remove(2));
    assert(!db.restore(1,"Duplicate","Drama",2000,7,""));
    assert(db.restore(50,"Restored","Drama",2000,10,""));assert(db.add("Next","Drama",2000,1,""));
    assert(db.snapshot().find("\"id\":51")!=std::string::npos);
    db.seed();assert(db.movies().size()==9);
    frame::Catalog capacity;for(int i=0;i<500;i++)assert(capacity.add("Movie","Drama",2000,5,""));
    assert(!capacity.add("Over capacity","Drama",2000,5,""));
    std::cout<<"PASS: recommendation boundaries, validation, search/filter, averages, CRUD, IDs, seed and capacity.\n";
}
