from random import choice

with open('items.txt') as items_file:
    item_line = items_file.readlines()

item_list = [item.strip() for item in item_line if item != "Loot"]
nb_drop   = int(item_list.pop(0)) 
loots     = {}

for i in range(nb_drop):
    loot = choice(item_list)
    if loot in loots.keys():
        loots[loot] += 1
    else :
        loots[loot] = 1

loots_file = open("loots.txt", "w")
for key, value in loots.items():
    if value > 1 :
        loots_file.write(f"- {key} x{value}\n")
    else :
        loots_file.write(f"- {key}\n")
loots_file.close()